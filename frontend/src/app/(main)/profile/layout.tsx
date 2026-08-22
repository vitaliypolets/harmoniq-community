import type { ReactNode } from 'react';

import { Container } from '@/components/ui/Container';
import { AuthGuard } from '@/features/auth/session';
import { ProfileTabs } from '@/features/profile';

import styles from './ProfilePage.module.css';

type ProfileLayoutProps = {
  children: ReactNode;
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

export default function ProfileLayout({ children, myArticles, savedArticles }: ProfileLayoutProps) {
  return (
    <AuthGuard>
      <section
        className={styles.page}
        aria-labelledby="profile-title"
      >
        <Container>
          {children}
          <ProfileTabs
            myArticles={myArticles}
            savedArticles={savedArticles}
          />
        </Container>
      </section>
    </AuthGuard>
  );
}
