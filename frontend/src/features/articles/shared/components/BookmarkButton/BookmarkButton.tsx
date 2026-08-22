"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Loader } from "@/components/ui/Loader/Loader";
import { useAuthStore } from "@/store/auth.store";

import {
  addSavedArticle,
  removeSavedArticle,
} from "@/features/profile/saved-articles/saved-articles.service";

import type { BookmarkButtonProps } from "../../article-shared.types";
import { ModalErrorSave } from "../ModalErrorSave/ModalErrorSave";

import styles from "./BookmarkButton.module.css";

type BookmarkAction = "save" | "remove";

type BookmarkError = {
  response?: {
    status?: number;
  };
};

export const BookmarkButton = ({
  articleId,
  isBookmarked,
  className,
  label,
  onBookmarkChange,
  onBookmarkToggle,
}: BookmarkButtonProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [saved, setSaved] = useState(isBookmarked);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSaved(isBookmarked);
  }, [isBookmarked]);

  const mutation = useMutation({
    mutationFn: async (action: BookmarkAction) => {
      if (action === "save") {
        return addSavedArticle(articleId);
      }

      return removeSavedArticle(articleId);
    },

    onSuccess: (_, action) => {
      const nextSaved = action === "save";

      setSaved(nextSaved);
      onBookmarkChange?.(articleId, nextSaved);
      onBookmarkToggle?.(nextSaved);
    },

    onError: (error) => {
      const status = (error as BookmarkError)?.response?.status;

      if (status === 409) {
        setSaved(true);
        onBookmarkChange?.(articleId, true);
        onBookmarkToggle?.(true);

        return;
      }

      const message =
        error instanceof Error ? error.message : "Unable to update bookmark. Please try again.";

      toast.error(message);
    },
  });

  const handleClick = () => {
    if (mutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage("To save this article, you need to authorize first");
      setShowErrorModal(true);

      return;
    }

    mutation.mutate(saved ? "remove" : "save");
  };

  const buttonClassName = [
    styles.button,
    saved ? styles.saved : "",
    label ? styles.withLabel : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        className={buttonClassName}
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-label={saved ? "Remove bookmark" : "Save bookmark"}
        aria-pressed={saved}
      >
        <svg className={styles.icon} viewBox="0 0 25 32" aria-hidden="true">
          <use href="/icons/sprite.svg#icon-security" />
        </svg>

        {label && <span className={styles.label}>{label}</span>}
      </button>

      {mutation.isPending && <Loader label="Saving..." />}

      {showErrorModal && (
        <ModalErrorSave
          title="Error while saving"
          description={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};
