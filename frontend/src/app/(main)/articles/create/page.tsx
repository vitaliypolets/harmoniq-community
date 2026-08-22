import type { Metadata } from 'next';

import { Container } from '@/components/ui/Container/Container';
import AddArticleForm from '@/features/articles/create/components/AddArticleForm/AddArticleForm';
import { AuthGuard } from '@/features/auth/session';

import styles from './CreateArticlePage.module.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

const pageTitle = 'Create an article';
const pageDescription = 'Create a new personal article in Harmoniq.';
const pageUrl = `${siteUrl}/articles/create`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
  },
};

export default function CreateArticlePage() {
  return (
    <AuthGuard>
      <section>
        <Container className={styles.page}>
          <h1 className={styles.title}>Create an article</h1>
          <AddArticleForm />
        </Container>
      </section>
    </AuthGuard>
  );
}
