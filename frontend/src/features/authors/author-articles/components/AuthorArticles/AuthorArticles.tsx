'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button/Button';
import { Loader } from '@/components/ui/Loader/Loader';
import { ArticlesList } from '@/features/articles/shared';
import type { Article } from '@/types/article';
import { getAuthorArticles } from '../../author-articles.service';
import type { AuthorArticlesProps } from '../../author-articles.types';
import styles from './AuthorArticles.module.css';

const ARTICLES_PER_PAGE = 8;

export function AuthorArticles({ userId, author }: AuthorArticlesProps) {
  const queryClient = useQueryClient();
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);

  const query = useInfiniteQuery({
    queryKey: ['authors', 'articles', userId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      queryClient.fetchQuery({
        queryKey: ['authors', 'articles', userId, 'page', pageParam, ARTICLES_PER_PAGE],
        queryFn: () => getAuthorArticles(userId, pageParam, ARTICLES_PER_PAGE),
        retry: false,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.hasNextPage ? lastPage.data.meta.page + 1 : undefined,
  });

  const lastPage = query.data?.pages.at(-1);
  const nextPageToPrefetch = lastPage?.data.meta.hasNextPage
    ? lastPage.data.meta.page + 1
    : null;

  useEffect(() => {
    if (nextPageToPrefetch === null) return;

    void queryClient.prefetchQuery({
      queryKey: ['authors', 'articles', userId, 'page', nextPageToPrefetch, ARTICLES_PER_PAGE],
      queryFn: () => getAuthorArticles(userId, nextPageToPrefetch, ARTICLES_PER_PAGE),
    });
  }, [nextPageToPrefetch, queryClient, userId]);

  useEffect(() => {
    if (query.isError && !query.data) {
      toast.error('Не вдалося завантажити статті автора.');
    }
  }, [query.data, query.isError]);

  useEffect(() => {
    if (query.isFetchNextPageError) {
      toast.error('Не вдалося завантажити більше статей.');
    }
  }, [query.isFetchNextPageError]);

  const articlesById = new Map<string, Article>();

  for (const page of query.data?.pages ?? []) {
    for (const article of page.data.items) {
      articlesById.set(article.id, {
        ...article,
        author,
      });
    }
  }

  const articles = Array.from(articlesById.values());

  useEffect(() => {
    const firstNewArticleIndex = pendingScrollIndexRef.current;

    if (firstNewArticleIndex === null || query.isFetchingNextPage) return;

    if (query.isFetchNextPageError || articles.length <= firstNewArticleIndex) {
      pendingScrollIndexRef.current = null;
      return;
    }

    const items = listWrapperRef.current?.querySelectorAll('li');
    const firstNewItem = items?.item(firstNewArticleIndex);

    firstNewItem?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    pendingScrollIndexRef.current = null;
  }, [articles.length, query.isFetchNextPageError, query.isFetchingNextPage]);

  const handleLoadMore = async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    pendingScrollIndexRef.current = articles.length;
    const result = await query.fetchNextPage();

    if (result.isError) pendingScrollIndexRef.current = null;
  };

  if (query.isPending) {
    return (
      <section className={styles.section} aria-label="Статті автора">
        <Loader />
      </section>
    );
  }

  if (query.isError && !query.data) {
    return (
      <section className={styles.section} aria-label="Статті автора">
        <div className={`${styles.state} ${styles.error}`} role="alert">
          <p>Не вдалося завантажити статті автора.</p>
          <Button
            className={styles.retryButton}
            size="sm"
            type="button"
            onClick={() => query.refetch()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Статті автора">
      {articles.length === 0 ? (
        <div className={styles.state} role="status">
          <p>Нічого не знайдено.</p>
        </div>
      ) : (
        <div ref={listWrapperRef}>
          <ArticlesList articles={articles} />
        </div>
      )}

      {query.isFetchNextPageError ? (
        <p className={styles.nextPageError} role="alert">
          Не вдалося завантажити більше статей.
        </p>
      ) : null}

      {query.hasNextPage ? (
        <div className={styles.loadMoreWrapper}>
          <Button
            className={styles.loadMoreButton}
            size="xl"
            type="button"
            disabled={query.isFetchingNextPage}
            onClick={handleLoadMore}
          >
            {query.isFetchingNextPage ? 'Завантаження...' : 'Показати ще'}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
