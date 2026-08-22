import Link from "next/link";
import styles from "../../ArticleDetailsClient.module.css";
import { RecommendedArticle as RecommendedArticleType } from "../../article-details.types";

type Props = {
  recommendations: RecommendedArticleType[];
};

function parseRecommendation(recommend: RecommendedArticleType) {
  const { title, id, author } = recommend;

  return {
    articleLink: id ? `/articles/${id}` : "#",
    articleTitle: title || "Без назви",
    authorName: author?.name || "Невідомий автор",
    authorLink: author?.id ? `/authors/${author.id}` : "#",
  };
}

const ArticleRecommendations = ({ recommendations }: Props) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <ul className={styles.recommendList}>
      {recommendations.map((item) => {
        const parsed = parseRecommendation(item);

        return (
          <li key={item.id} className={styles.recommendItem}>
            <div className={styles.recommendArticleLinkItem}>
              <Link href={parsed.articleLink} className={styles.recommendArticleLink}>
                {parsed.articleTitle}
                <div className={styles.recommendArticleiconWrapper}>
                  <svg className={styles.recommendArticleicon} width="40" height="40">
                    <use href="/icons/sprite.svg#icon-arrow-right"></use>
                  </svg>
                </div>
              </Link>
            </div>
            <Link href={parsed.authorLink} className={styles.recommendAuthorLink}>
              {parsed.authorName}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleRecommendations;
