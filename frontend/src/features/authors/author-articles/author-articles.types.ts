import type { PaginatedResponse } from '@/types/api';
import type { Article } from '@/types/article';
import type { PublicUser } from '@/types/user';

export type AuthorArticlesProps = {
  userId: string;
  author: PublicUser;
};

export type AuthorArticleApiItem = Pick<
  Article,
  'id' | 'title' | 'description' | 'imageUrl' | 'publicationDate'
>;

export type UserArticlesPage = PaginatedResponse<AuthorArticleApiItem>;
