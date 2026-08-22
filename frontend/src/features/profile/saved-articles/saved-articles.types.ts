import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Article } from '@/types/article';

export type SavedArticlesPage = PaginatedResponse<Article>;
export type SavedArticle = Article & { isBookmarked: true };

export type BookmarkMutationResponse = ApiResponse<Article | { articleId: string }>;
