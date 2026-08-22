import { api } from '@/lib/api/client';
import type { getArticlesParams, getArticlesResponse } from './articles-catalog.types';

export const getArticles = async (
  params: getArticlesParams = {}
): Promise<getArticlesResponse> => {
  const {
    page = 1,
    perPage = 8,
    filter = 'all',
    authorId,
    excludeId,
    limit,
  } = params;

  const response = await api.get<getArticlesResponse>('/articles', {
    params: {
      page: Math.max(1, page),
      perPage: Math.max(1, perPage),
      filter: typeof filter === 'string' ? filter : 'all',
      ...(authorId && { authorId }),
      ...(excludeId && { excludeId }),
      ...(limit && limit > 0 && { limit }),
    },
  });

  return response.data;
};
