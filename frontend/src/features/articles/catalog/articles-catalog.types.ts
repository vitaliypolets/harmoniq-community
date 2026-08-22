// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md
import type { Article } from '@/types/article';
import type { PaginatedResponse } from '@/types/api';

export type ArticleFilter = 'all' | 'popular';

export type getArticlesParams = {
  page?: number;
  perPage?: number;
  filter?: ArticleFilter;
  authorId?: string;
  excludeId?: string;
  limit?: number;
};

export type getArticlesResponse = PaginatedResponse<Article>;

export type ArticlesCounterProps = {
  totalItems: number;
};

export type ArticlesFiltersProps = {
  activeFilter: ArticleFilter;
  onFilterChange: (filter: ArticleFilter) => void;
};

export type ArticlesCatalogProps = {
  articles: Article[];
  totalItems: number;
  activeFilter: ArticleFilter;
  isLoading?: boolean;
  isError?: boolean;
  isLoadingMore?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
};
