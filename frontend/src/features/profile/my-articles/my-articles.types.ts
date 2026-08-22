import type { PaginatedResponse } from '@/types/api';
import type { Article } from '@/types/article';

export type ArticlesPage = PaginatedResponse<Article>;
