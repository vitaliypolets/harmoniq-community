'use client';

import { useEffect, useRef } from 'react';
import {
  type InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { Loader } from '@/components/ui/Loader/Loader';
import { AddArticleForm } from '@/features/articles/create';
import { ArticlesList } from '@/features/articles/shared';
import { useAuthStore } from '@/store/auth.store';

import { getMyArticles } from '../my-articles.service';
import type { ArticlesPage } from '../my-articles.types';
import { EmptyArticlesState } from './EmptyArticlesState';

import styles from './ArticlesTab.module.css';

export function MyArticlesTab() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const userId = user?.id;
  const queryKey = ['profile', 'my-articles', userId] as const;

  const author =
    user && userId
      ? {
          id: userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
          articlesAmount: user.articlesAmount,
        }
      : null;

  const active =
    (searchParams.get('tab') ?? 'my-articles') === 'my-articles';

  const query = useInfiniteQuery({
    queryKey,
    enabled: active && Boolean(userId && author),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMyArticles(userId!, author!, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.hasNextPage
        ? lastPage.data.meta.page + 1
        : undefined,
  });

  const isPaused = query.fetchStatus === 'paused';
  const hasQueryError = query.isError || isPaused;
  const errorMessage = isPaused
    ? 'You appear to be offline. Check your connection and try again.'
    : 'Could not load your articles.';

  useEffect(() => {
    const toastId = 'my-articles-query-error';

    if (!active || !hasQueryError) {
      toast.dismiss(toastId);
      return;
    }

    toast.error(errorMessage, {
      id: toastId,
    });
  }, [active, errorMessage, hasQueryError]);

  const articles =
    query.data?.pages.flatMap((page) => page.data.items) ?? [];

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

  const handleArticleDeleted = (articleId: string) => {
    let wasDeleted = false;

    queryClient.setQueryData<InfiniteData<ArticlesPage>>(
      queryKey,
      (currentData) => {
        if (
          !currentData ||
          !currentData.pages.some((page) =>
            page.data.items.some((article) => article.id === articleId),
          )
        ) {
          return currentData;
        }

        wasDeleted = true;

        return {
          ...currentData,
          pages: currentData.pages.map((page) => {
            const totalItems = Math.max(0, page.data.meta.totalItems - 1);
            const totalPages = Math.ceil(totalItems / page.data.meta.perPage);

            return {
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (article) => article.id !== articleId,
                ),
                meta: {
                  ...page.data.meta,
                  totalItems,
                  totalPages,
                  hasNextPage: page.data.meta.page < totalPages,
                },
              },
            };
          }),
        };
      },
    );

    if (!wasDeleted) return;

    updateUser({
      articlesAmount: Math.max(0, (user?.articlesAmount ?? 0) - 1),
    });

    void queryClient.invalidateQueries({ queryKey });
    void queryClient.invalidateQueries({
      queryKey: ['saved-articles', userId],
    });
  };

  if (!active) return null;

  return (
    <section
      className={styles.section}
      aria-label="My Articles"
    >
      {!isInitialized ||
      (Boolean(userId) &&
        query.isPending &&
        query.fetchStatus === 'fetching') ? (
        <Loader />
      ) : null}

      {isInitialized && !userId ? (
        <p className={styles.error} role="alert">
          Log in to view your articles.
        </p>
      ) : null}

      {hasQueryError ? (
        <div className={styles.error} role="alert">
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {query.isSuccess && !hasQueryError && articles.length === 0 ? (
        <EmptyArticlesState
          description="Write your first article"
        >
          <AddArticleForm />
        </EmptyArticlesState>
      ) : null}

      {articles.length > 0 ? (
        <div ref={listWrapperRef} className={styles.articles}>
          <ArticlesList
            articles={articles}
            action="edit"
            onArticleDeleted={handleArticleDeleted}
          />
        </div>
      ) : null}

      {query.hasNextPage ? (
        <button
          className={styles.loadMore}
          type="button"
          disabled={query.isFetchingNextPage}
          onClick={handleLoadMore}
        >
          {query.isFetchingNextPage
            ? 'Loading...'
            : 'Load More'}
        </button>
      ) : null}
    </section>
  );
}
