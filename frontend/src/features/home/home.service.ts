import { api } from "@/lib/api/client";

import type { ArticlesApiResponse, ArticlesResponse, CreatorsResponse } from "./home.types";

export const getTopCreators = async (): Promise<CreatorsResponse> => {
  const response = await api.get<CreatorsResponse>("/users", {
    params: { sort: "articlesAmount", perPage: 6 },
  });

  return response.data;
};

export const getPopularArticles = async (perPage = 4): Promise<ArticlesResponse> => {
  const response = await api.get<ArticlesApiResponse>("/articles", {
    params: { filter: "popular", perPage },
  });

  const { items, meta } = response.data.data;

  return {
    articles: items,
    page: meta.page,
    perPage: meta.perPage,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
    hasNextPage: meta.hasNextPage,
    hasPreviousPage: meta.hasPreviousPage,
  };
};
