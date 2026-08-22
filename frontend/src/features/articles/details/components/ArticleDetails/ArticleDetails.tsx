import Image from "next/image";
import styles from "../../ArticleDetailsClient.module.css";
import type { ArticleDetails as ArticleDetailsType } from "@/types/article";

type Props = {
  article: ArticleDetailsType;
  children?: React.ReactNode;
};

const ArticleDetails = ({ article, children }: Props) => {
  return (
    <article className={styles.articleContent}>
      <h1 className={styles.titleMainTitle}>{article.title}</h1>

      {article.imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={361}
            height={183}
            className={styles.imageArticle}
            priority
          />
        </div>
      )}

      <div className={styles.subContentArticle}>
        <div className={styles.articleContentText}>{article.article.replaceAll("/n", "\n\n")}</div>

        {children}
      </div>
    </article>
  );
};

export default ArticleDetails;
