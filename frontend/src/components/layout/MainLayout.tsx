import type { ReactNode } from 'react';

import Header from '../../components/Header/Header';
import { Footer } from '@/components/Footer';

import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
