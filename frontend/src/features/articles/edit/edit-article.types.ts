import type { ApiResponse } from "@/types/api";

export type EditArticleFormValues = {
  title: string;
  article: string;
  publicationDate: string;
  image: File | null;
};

export type UpdatedArticle = {
  id: string;
  title: string;
  description: string;
  article: string;
  imageUrl: string | null;
  publicationDate: string;
  authorId: string;
  viewsCount: number;
  category: "popular" | "general";
};

export type UpdateArticleResponse = ApiResponse<UpdatedArticle>;
