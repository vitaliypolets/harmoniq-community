import type { Article } from "@/types/article";

export type ArticlesItemAction = "bookmark" | "edit";

export type BookmarkChangeHandler = (articleId: string, isBookmarked: boolean) => void;

export type BookmarkToggleHandler = (isBookmarked: boolean) => void;

export type ArticleDeletedHandler = (articleId: string) => void;

export type ArticlesItemProps = {
  article: Article;
  action?: ArticlesItemAction;
  className?: string;
  onBookmarkChange?: BookmarkChangeHandler;
  onArticleDeleted?: ArticleDeletedHandler;
};

export type ArticlesListProps = {
  articles: Article[];
  action?: ArticlesItemAction;
  onBookmarkChange?: BookmarkChangeHandler;
  onArticleDeleted?: ArticleDeletedHandler;
};

export type BookmarkButtonProps = {
  articleId: string;
  isBookmarked: boolean;
  className?: string;
  label?: string;
  onBookmarkChange?: BookmarkChangeHandler;
  onBookmarkToggle?: BookmarkToggleHandler;
};

export type ModalErrorSaveProps = {
  title?: string;
  description: string;
  onClose: () => void;
};
