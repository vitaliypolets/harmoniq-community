import type { Article } from "@/types/article";
import type { PaginatedResponse } from "@/types/api";

export interface Creator {
  id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
}

export type CreatorsResponse = PaginatedResponse<Creator>;

export interface ArticlesResponse {
  articles: Article[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ArticlesApiResponse {
  data: {
    items: Article[];
    meta: {
      page: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
}
