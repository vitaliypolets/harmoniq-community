import { api } from '@/lib/api/client';
import type { PublicUser } from '@/types/user';
import type { AuthorResponse, AuthorsResponse } from './authors.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';


export const getAuthors = async (page = 1): Promise<AuthorsResponse> => {
  const { data } = await api.get<PaginatedResponse<AuthorResponse>>(`/users?page=${page}&perPage=20`);
const { items, meta } = data.data;
  return {
    authors: items.map((author) => ({
      id: author.id,
      name: author.name,
      avatarUrl: author.avatarUrl ?? null,
     articlesAmount: author.articlesAmount,
    })),
    total: meta.totalItems,
    page: meta.page,
    perPage: meta.perPage,
    hasNextPage: meta.hasNextPage,
  };
};

export const getAuthorById = async (userId: string): Promise<PublicUser> => {
  const { data } = await api.get<ApiResponse<AuthorResponse>>(`/users/${userId}`);
  return {
    id: data.data.id,
    name: data.data.name,
    avatarUrl: data.data.avatarUrl,
    articlesAmount: data.data.articlesAmount,
  };
};



