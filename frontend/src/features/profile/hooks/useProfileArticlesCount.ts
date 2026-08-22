'use client';

import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { PaginatedResponse } from '@/types/api';

type ProfileArticlesCountOptions = {
  userId: string | undefined;
  myArticlesFallback: number;
};

type ProfileArticlesPages = InfiniteData<PaginatedResponse<unknown>>;

export function useProfileArticlesCount({
  userId,
  myArticlesFallback,
}: ProfileArticlesCountOptions) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const isSavedArticles = searchParams.get('tab') === 'saved-articles';

  const queryKey = useMemo<QueryKey>(
    () =>
      isSavedArticles
        ? ['saved-articles', userId]
        : ['profile', 'my-articles', userId],
    [isSavedArticles, userId],
  );

  const getSnapshot = useCallback(() => {
    if (!userId) return 0;

    const pages = queryClient.getQueryData<ProfileArticlesPages>(queryKey);
    const totalItems = pages?.pages[0]?.data.meta.totalItems;

    if (totalItems !== undefined) return totalItems;

    return isSavedArticles ? 0 : myArticlesFallback;
  }, [isSavedArticles, myArticlesFallback, queryClient, queryKey, userId]);

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      queryClient.getQueryCache().subscribe(onStoreChange),
    [queryClient],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
