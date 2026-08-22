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
        Завантаження статтей...
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.errorMessage}>
        Щось пішло не так. Не вдалося завантажити статті.
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={css.statusMessage}>
        Статей не знайдено.
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
            {isLoadingMore ? 'Завантаження...' : 'Показати ще'}
          </button>
        </div>
      )}
    </div>
  );
};
