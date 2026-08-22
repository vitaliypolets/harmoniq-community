import { useEffect, useRef } from 'react';

import { ArticlesList } from '@/features/articles/shared';

import type { ArticlesCatalogProps } from '../../articles-catalog.types';

import css from './ArticlesCatalog.module.css';

export const ArticlesCatalog = ({
  articles,
  isLoading,
  isError,
  isLoadingMore,
  hasNextPage,
  onLoadMore,
}: ArticlesCatalogProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(articles?.length || 0);

  useEffect(() => {
    const currentCount = articles?.length || 0;
    const prevCount = prevCountRef.current;

    if (
      currentCount > prevCount &&
      prevCount > 0 &&
      containerRef.current
    ) {
      const cards = containerRef.current.querySelectorAll('li');
      const firstNewCard = cards[prevCount];

      if (firstNewCard) {
        firstNewCard.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }

    prevCountRef.current = currentCount;
  }, [articles]);

  if (isLoading) {
    return (
      <div className={css.statusMessage}>
        Loading articles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.errorMessage}>
        Something went wrong. Failed to load articles.
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={css.statusMessage}>
        No articles found.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={css.catalogContainer}
    >
      <ArticlesList articles={articles} />

      {hasNextPage && (
        <div className={css.loadMoreWrapper}>
          <button
            type="button"
            className={css.loadMoreBtn}
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
