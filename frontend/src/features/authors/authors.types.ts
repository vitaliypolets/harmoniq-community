import type { PaginatedResponse } from '@/types/api';
import type { PublicUser } from '@/types/user';

export type AuthorResponse = {
  id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
};
export type AuthorsApiResponse = PaginatedResponse<AuthorResponse>;

export type AuthorsResponse = {
  authors: PublicUser[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
};


