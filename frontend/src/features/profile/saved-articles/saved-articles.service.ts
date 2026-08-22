import { api } from '@/lib/api/client';
import type { BookmarkMutationResponse, SavedArticlesPage } from './saved-articles.types';

export async function getSavedArticles(page = 1, perPage = 12) {
  const response = await api.get<SavedArticlesPage>('/users/me/bookmarks', {
    params: { page, perPage },
  });

  return response.data;
}

export async function addSavedArticle(articleId: string) {
  const response = await api.post<BookmarkMutationResponse>('/users/me/bookmarks', { articleId });

  return response.data;
}

export async function removeSavedArticle(articleId: string) {
  const response = await api.delete<BookmarkMutationResponse>(`/users/me/bookmarks/${articleId}`);

  return response.data;
}
