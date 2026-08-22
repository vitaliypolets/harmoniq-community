import { api } from "@/lib/api/client";

import type {
  EditArticleFormValues,
  UpdateArticleResponse,
  UpdatedArticle,
} from "./edit-article.types";

export const updateArticle = async (
  articleId: string,
  values: EditArticleFormValues,
): Promise<UpdatedArticle> => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("article", values.article);
  formData.append("publicationDate", values.publicationDate);

  if (values.image) {
    formData.append("image", values.image);
  }

  const response = await api.patch<UpdateArticleResponse>(`/articles/${articleId}`, formData);

  return response.data.data;
};

export const deleteArticle = async (articleId: string): Promise<void> => {
  await api.delete(`/articles/${articleId}`);
};
