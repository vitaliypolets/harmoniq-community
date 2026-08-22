import type { PublicUser } from '@/types/user';

import AuthorsItem from '../AuthorsItem/AuthorsItem';
import styles from './AuthorsList.module.css';

type AuthorsListProps = {
  authors: PublicUser[];
};

export default function AuthorsList({ authors }: AuthorsListProps) {
  if (authors.length === 0) {
    return <p className={styles.empty}>No authors found.</p>;
  }

  return (
    <ul className={styles.list}>
      {authors.map(author => (
        <li className={styles.item} key={author.id} data-author-id={author.id}>
          <AuthorsItem author={author} />
        </li>
      ))}
    </ul>
  );
}

