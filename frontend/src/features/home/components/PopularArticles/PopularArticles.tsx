'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@/components/ui/Container/Container';
import { Loader } from '@/components/ui/Loader/Loader';
import { ArticlesItem } from '@/features/articles/shared/components/ArticlesItem/ArticlesItem';

import { getPopularArticles } from '../../home.service';
import styles from './PopularArticles.module.css';

export const PopularArticles = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popularArticles'],
    queryFn: () => getPopularArticles(4),
  });

  return (
    <section
      className={styles.section}
      id="popular-articles"
    >
      <Container className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Популярні статті
          </h2>

          <Link
            href="/articles"
            className={styles.link}
            scroll
          >
            Перейти до всіх статей{' '}
            <span className={styles.arrow}>
              ↗
            </span>
          </Link>
        </div>

        {isLoading && (
          <div className={styles.centerContainer}>
            <Loader />
          </div>
        )}

        {isError && (
          <div className={styles.centerContainer}>
            <p>Не вдалося завантажити популярні статті.</p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          data?.articles && (
            <ul className={styles.list}>
              {data.articles.map((article) => (
                <li
                  className={styles.listItem}
                  key={article.id}
                >
                  <ArticlesItem article={article} />
                </li>
              ))}
            </ul>
          )}
      </Container>
    </section>
  );
};
