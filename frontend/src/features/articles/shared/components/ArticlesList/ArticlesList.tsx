import type { ArticlesListProps } from "../../article-shared.types";

import { ArticlesItem } from "../ArticlesItem/ArticlesItem";
import styles from "./ArticlesList.module.css";

export const ArticlesList = ({
  articles,
  action,
  onBookmarkChange,
  onArticleDeleted,
}: ArticlesListProps) => {
  return (
    <ul className={styles.list}>
      {articles.map((article) => (
        <li className={styles.listItem} key={article.id}>
          <ArticlesItem
            article={article}
            action={action}
            onBookmarkChange={onBookmarkChange}
            onArticleDeleted={onArticleDeleted}
          />
        </li>
      ))}
    </ul>
  );
};
