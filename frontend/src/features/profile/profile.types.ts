import type { ReactNode } from 'react';

export type ProfileTab = 'my-articles' | 'saved-articles';

export type ProfileInfoProps = {
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
};

export type ProfileTabsProps = {
  myArticles: ReactNode;
  savedArticles: ReactNode;
};
