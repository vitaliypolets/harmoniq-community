import type { ReactNode } from 'react';

import Header from '@/components/Header/Header';
import { Footer } from '@/components/Footer';

import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header sticky={false} />

      <main className={styles.main}>{children}</main>

      <Footer isAuthPage />
    </div>
  );
}
