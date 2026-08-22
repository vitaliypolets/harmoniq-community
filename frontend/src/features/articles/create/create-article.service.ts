// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md

import { api } from '@/lib/api/client';

import type {
  CreateArticleFormValues,
  CreateArticleResponse,
  CreatedArticle,
} from './create-article.types';

export const createArticle = async (
  values: CreateArticleFormValues,
): Promise<CreatedArticle> => {
  const formData = new FormData();

  formData.append('title', values.title);
  formData.append('article', values.article);
  formData.append(
    'publicationDate',
    values.publicationDate,
  );

  if (values.image) {
    formData.append('image', values.image);
  }

  const response = await api.post<CreateArticleResponse>(
    '/articles',
    formData,
  );

  return response.data.data;
};
