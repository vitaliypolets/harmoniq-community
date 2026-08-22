import type { ArticleDetails } from '@/types/article';

export type ArticleAuthor = {
  id: string;
  name: string;
};

export type RecommendedArticle = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  publicationDate: string;
  category: string;
  viewsCount: number;
  author: ArticleAuthor | null;
};

export type ArticleDetailsResponse = {
  data: {
    article: ArticleDetails;
    author: ArticleAuthor | null;
    isBookmarked: boolean;
    recommendations: RecommendedArticle[];
  };
  message: string;
};
