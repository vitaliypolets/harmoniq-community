'use client';

import ArticlesLoading from './loading';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import {
  ArticlesCatalog,
  ArticlesCounter,
  ArticlesFilters,
  useArticlesQuery,
  type ArticleFilter,
} from '@/features/articles/catalog';

import styles from './ArticlesPage.module.css';

export default function ArticlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilterParam = searchParams.get('filter');

  const activeFilter: ArticleFilter =
    currentFilterParam === 'popular' ? 'popular' : 'all';

  const {
    articles,
    totalItems,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useArticlesQuery(activeFilter);

  const handleFilterChange = (newFilter: ArticleFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('filter', newFilter);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  if (isLoading) {
    return <ArticlesLoading />;
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Articles</h1>

      <div className={styles.controlsWrapper}>
        <ArticlesCounter totalItems={totalItems} />

        <ArticlesFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <ArticlesCatalog
        articles={articles}
        totalItems={totalItems}
        activeFilter={activeFilter}
        isLoading={isLoading}
        isError={isError}
        isLoadingMore={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={() => fetchNextPage()}
      />
    </main>
  );
}
