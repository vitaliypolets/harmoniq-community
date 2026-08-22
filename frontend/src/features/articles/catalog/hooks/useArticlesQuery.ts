import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { getArticles } from '../articles-catalog.service';
import type { ArticleFilter } from '../articles-catalog.types';

const PER_PAGE = 6;

export const useArticlesQuery = (activeFilter: ArticleFilter = 'all') => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['articles', activeFilter],
    queryFn: ({ pageParam = 1 }) =>
      getArticles({
        page: pageParam,
        perPage: PER_PAGE,
        filter: activeFilter,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.hasNextPage
        ? lastPage.data.meta.page + 1
        : undefined,
  });

  useEffect(() => {
    if (query.hasNextPage && query.data) {
      const nextPage = query.data.pages.length + 1;

      queryClient.prefetchQuery({
        queryKey: ['articles', activeFilter, 'page', nextPage],
        queryFn: () =>
          getArticles({
            page: nextPage,
            perPage: PER_PAGE,
            filter: activeFilter,
          }),
      });
    }
  }, [
    query.hasNextPage,
    query.data,
    activeFilter,
    queryClient,
  ]);

  const articles = useMemo(() => {
    const rawArticles =
      query.data?.pages.flatMap(
        (page) => page.data.items,
      ) ?? [];

    return Array.from(
      new Map(
        rawArticles.map((item) => [item.id, item]),
      ).values(),
    );
  }, [query.data]);

  const totalItems =
    query.data?.pages[0]?.data.meta.totalItems ?? 0;

  return {
    ...query,
    articles,
    totalItems,
  };
};
