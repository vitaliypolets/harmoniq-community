"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { useState } from "react";

import { fetchArticleById } from "./article-details.service";
import styles from "./ArticleDetailsClient.module.css";
import { Container } from "@/components/ui/Container/Container";

import ArticleDetails from "./components/ArticleDetails/ArticleDetails";
import ArticleAuthor from "./components/ArticleAuthor/ArticleAuthor";
import ArticleRecommendations from "./components/ArticleRecommendations/ArticleRecommendations";
import { BookmarkButton } from "../shared";
import { Loader } from "@/components/ui/Loader/Loader";

type ArticleDetailsData = Awaited<ReturnType<typeof fetchArticleById>>;

type Props = {
  articleId: string;
  initialData?: ArticleDetailsData;
};

const ArticleDetailsClient = ({ articleId, initialData }: Props) => {
  const queryClient = useQueryClient();

  const [recommendations, setRecommendations] = useState(initialData?.recommendations ?? []);

  const { data, isLoading, error } = useQuery<ArticleDetailsData>({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticleById(articleId, true),
    enabled: Boolean(articleId),
    staleTime: 0,
    initialData,
    initialDataUpdatedAt: 0,
  });
  if (error) {
    const err = error as { status?: number; response?: { status?: number } };
    if (err.status === 404 || err.response?.status === 404) {
      notFound();
    }
  }

  if (recommendations.length === 0 && data?.recommendations?.length) {
    setRecommendations(data.recommendations);
  }

  if (isLoading || !data) {
    return <Loader />;
  }

  const { article, author, isBookmarked } = data;

  const publicationDate = article.publicationDate;

  const handleBookmarkToggle = (isBookmarked: boolean) => {
    queryClient.setQueryData<ArticleDetailsData>(["article", articleId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        isBookmarked,
      };
    });
  };
  const bookmarkLabel = isBookmarked ? "Unsave" : "Save";

  return (
    <Container>
      <div className={styles.article}>
        <ArticleDetails article={article}>
          <div className={styles.subContent}>
            <div className={styles.recomendation}>
              <ArticleAuthor author={author} publicationDate={publicationDate} />

              <p className={styles.intrastedText}>You can also interested</p>

              <ArticleRecommendations recommendations={recommendations} />
            </div>

            <div className={styles.articleBookmarkWrapper}>
              <BookmarkButton
                articleId={article.id}
                isBookmarked={isBookmarked}
                className={styles.articleBookmarkButton}
                label={bookmarkLabel}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </div>
          </div>
        </ArticleDetails>
      </div>
    </Container>
  );
};

export default ArticleDetailsClient;
