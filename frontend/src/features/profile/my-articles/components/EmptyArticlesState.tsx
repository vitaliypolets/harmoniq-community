import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import alertIcon from '../assets/alert.svg';
import styles from './ArticlesTab.module.css';

type EmptyArticlesStateBaseProps = {
  description: string;
};

type EmptyArticlesStateProps = EmptyArticlesStateBaseProps & ({
  actionLabel: string;
  href: string;
  children?: never;
} | {
  actionLabel?: never;
  href?: never;
  children: ReactNode;
});

export function EmptyArticlesState({
  description,
  actionLabel,
  href,
  children,
}: EmptyArticlesStateProps) {
  return (
    <div
      className={`${styles.emptyState} ${children ? styles.emptyStateWithContent : ''}`}
    >
      <span className={styles.alertIcon} aria-hidden="true">
        <Image src={alertIcon} width={40} height={40} alt="" />
      </span>
      <h2>Nothing found.</h2>
      <p>{description}</p>
      {children ? (
        <div className={styles.emptyContent}>{children}</div>
      ) : href && actionLabel ? (
        <Link className={styles.emptyAction} href={href}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
