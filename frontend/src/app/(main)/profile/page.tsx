'use client';

import { ProfileInfo } from '@/features/profile';
import { useProfileArticlesCount } from '@/features/profile/hooks/useProfileArticlesCount';
import { useAuthStore } from '@/store/auth.store';

import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const articlesAmount = useProfileArticlesCount({
    userId: user?.id,
    myArticlesFallback: user?.articlesAmount ?? 0,
  });

  return (
    <header className={styles.header}>
      <h1
        className={styles.title}
        id="profile-title"
      >
        My Profile
      </h1>

      {user ? (
        <ProfileInfo
          name={user.name}
          avatarUrl={user.avatarUrl}
          articlesAmount={articlesAmount}
        />
      ) : null}
    </header>
  );
}
