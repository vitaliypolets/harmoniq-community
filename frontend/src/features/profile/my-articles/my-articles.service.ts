import { api } from '@/lib/api/client';
import type { PaginatedResponse } from '@/types/api';
import type { Article } from '@/types/article';
import type { PublicUser } from '@/types/user';
import type { ArticlesPage } from './my-articles.types';

type MyArticleApiItem = Pick<
  Article,
  'id' | 'title' | 'description' | 'imageUrl' | 'publicationDate'
>;

type ArticlesApiPage = PaginatedResponse<MyArticleApiItem>;

export async function getMyArticles(
  userId: string,
  author: PublicUser,
  page = 1,
  perPage = 12,
): Promise<ArticlesPage> {
  const response = await api.get<ArticlesApiPage>(`/users/${userId}/articles`, {
    params: { page, perPage },
  });

  return {
    ...response.data,
    data: {
      ...response.data.data,
      items: response.data.data.items.map((article) => ({
        ...article,
        author,
      })),
    },
  };
}
