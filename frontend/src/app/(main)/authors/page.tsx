'use client';

import { Loader } from '@/components/ui/Loader/Loader';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import type { PublicUser } from '@/types/user';
import Button from '@/components/ui/Button/Button';
import { getAuthors } from '@/features/authors/authors.service';

import styles from './AuthorsPage.module.css';
import AuthorsList from '@/features/authors/components/AuthorsList/AuthorsList';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Container } from '@/components/ui/Container';

export default function AuthorsPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      initialPageParam: 1,

      queryFn: ({ pageParam }) =>
        queryClient.fetchQuery({
          queryKey: ['authors-page', pageParam],
          queryFn: () => getAuthors(pageParam),
        }),

      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNextPage) {
          return undefined;
        }

        return lastPage.page + 1;
      },
    });

  const authors: PublicUser[] = data?.pages.flatMap((page) => page.authors) ?? [];

  useEffect(() => {
    const lastPage = data?.pages.at(-1);

    if (!lastPage?.hasNextPage) {
      return;
    }

    const nextPage = lastPage.page + 1;

    queryClient.prefetchQuery({
      queryKey: ['authors-page', nextPage],
      queryFn: () => getAuthors(nextPage),
    });
  }, [data, queryClient]);
  useEffect(() => {
    if (isError && !data) {
      toast.error('Не вдалося завантажити авторів');
    }
  }, [isError, data]);

  const handleLoadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    try {
      const result = await fetchNextPage();

      if (result.isSuccess) {
        const newPage = result.data.pages.at(-1);

        const firstNewAuthor = newPage?.authors[0];

        if (firstNewAuthor) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              const element = document.querySelector(`[data-author-id="${firstNewAuthor.id}"]`);

              element?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }, 0);
          });
        }
      }
    } catch {
      toast.error('Не вдалося завантажити авторів');
    }
  };

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return null;
  }

  return (
    <section className={styles.page}>
      <Container>
        <h1 className={styles.title}>Authors</h1>

        <AuthorsList authors={authors} />

        {hasNextPage && (
          <Button
            type="button"
            size="xl"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className={styles.button}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </Container>
    </section>
  );
}
