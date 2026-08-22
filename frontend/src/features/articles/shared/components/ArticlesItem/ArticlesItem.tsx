"use client";

import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { api } from "@/lib/api/client";

import type { ArticlesItemProps } from "../../article-shared.types";
import { BookmarkButton } from "../BookmarkButton/BookmarkButton";

import styles from "./ArticlesItem.module.css";

export const ArticlesItem = ({
  article,
  action = "bookmark",
  className,
  onBookmarkChange,
  onArticleDeleted,
}: ArticlesItemProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const imageUrl = article.imageUrl.match(/\((.*?)\)/)?.[1] ?? article.imageUrl;

  const { mutate: deleteArticle, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await api.delete(`/articles/${article.id}`);
    },

    onSuccess: () => {
      setIsDeleteModalOpen(false);
      toast.success("Article deleted successfully!");
      onArticleDeleted?.(article.id);
    },

    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete article");
    },
  });

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <article className={`${styles.article} ${className ?? ""}`}>
        <Image
          className={styles.image}
          src={imageUrl}
          alt={article.title}
          width={368}
          height={233}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) calc(50vw - 48px), 356px"
          quality={70}
        />

        <div className={styles.content}>
          <p className={styles.author}>{article.author.name}</p>

          <h2 className={styles.title}>{article.title}</h2>

          <p className={styles.description}>{article.description}</p>
        </div>

        <div className={styles.actions}>
          <Button
            href={`/articles/${article.id}`}
            variant="secondary"
            size="sm"
            className={styles.learnMore}
          >
            Learn more
          </Button>

          {action === "edit" ? (
            <>
              <Button
                href={`/articles/${article.id}/edit`}
                variant="secondary"
                size="sm"
                className={styles.editButton}
                aria-label="Edit article"
              >
                <svg className={styles.editIcon} aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-edit" />
                </svg>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className={styles.deleteButton}
                aria-label="Delete article"
                disabled={isDeleting}
                onClick={handleDelete}
              >
                <svg className={styles.deleteIcon} aria-hidden="true">
                  <use href="/icons/sprite.svg#icon-delete" />
                </svg>
              </Button>
            </>
          ) : (
            <BookmarkButton
              articleId={article.id}
              isBookmarked={article.isBookmarked ?? false}
              className={styles.bookmark}
              onBookmarkChange={onBookmarkChange}
            />
          )}
        </div>
      </article>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteArticle}
        description="Are you sure you want to delete this article?"
        isLoading={isDeleting}
      />
    </>
  );
};
