import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ArticleDraft } from '@/features/articles/create/create-article.types';

type ArticleDraftStore = {
  draft: ArticleDraft;
  setDraft: (article: ArticleDraft) => void;
  clearDraft: () => void;
};

const getCurrentDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const initialDraft: ArticleDraft = {
  title: '',
  article: '',
  publicationDate: getCurrentDate(),
};

export const useArticleDraftStore = create<ArticleDraftStore>()(
  persist(
    set => ({
      draft: initialDraft,

      setDraft: article =>
        set({
          draft: article,
        }),

      clearDraft: () =>
        set({
          draft: initialDraft,
        }),
    }),
    {
      name: 'article-draft',

      partialize: state => ({
        draft: state.draft,
      }),
    },
  ),
);
