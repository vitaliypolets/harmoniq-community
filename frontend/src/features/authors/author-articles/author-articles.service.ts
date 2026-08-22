import { api } from '@/lib/api/client';
import type { UserArticlesPage } from './author-articles.types';

export async function getAuthorArticles(userId: string, page = 1, perPage = 8) {
  const response = await api.get<UserArticlesPage>(`/users/${userId}/articles`, {
    params: { page, perPage },
  });

  return response.data;
}
