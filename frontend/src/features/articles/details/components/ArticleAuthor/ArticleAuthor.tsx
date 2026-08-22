import Link from 'next/link';
import styles from '../../ArticleDetailsClient.module.css';
import { ArticleAuthor as ArticleAuthorType } from '../../article-details.types';

type Props = {
  author: ArticleAuthorType | null;
  publicationDate: string;
};
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const ArticleAuthor = ({ author, publicationDate }: Props) => {
  const authorLink = author?.id ? `/authors/${author.id}` : '/login';

  return (
    <div className={styles.authorWrapper}>
      <p className={styles.authorSubText}>
        Author:
        <Link
          href={authorLink}
          className={styles.authorTextName}
        >
          {author?.name}
        </Link>
      </p>
      <p className={styles.authorSubText}>
        Publication date: <span className={styles.authorText}>{formatDate(publicationDate)}</span>
      </p>
    </div>
  );
};

export default ArticleAuthor;
