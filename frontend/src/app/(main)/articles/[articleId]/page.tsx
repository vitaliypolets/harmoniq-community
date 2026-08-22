import { cookies } from "next/headers";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchArticleById } from "@/features/articles/details/article-details.service";
import ArticleDetailsClient from "@/features/articles/details/ArticleDetailsClient";

import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ articleId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleId } = await params;

  try {
    const data = await fetchArticleById(articleId);

    const ogImages = data.article.imageUrl
      ? [
          {
            url: data.article.imageUrl,
            width: 1200,
            height: 630,
            alt: data.article.title ?? "",
          },
        ]
      : [];

    const twitterImages = data.article.imageUrl ? [data.article.imageUrl] : [];

    return {
      title: `${data.article.title}`,
      description: data.article.description,
      openGraph: {
        title: `${data.article.title}`,
        description: data.article.description,
        url: ``,
        images: ogImages,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.article.title}`,
        description: data.article.description,
        images: twitterImages,
      },
    };
  } catch {
    return {
      title: "Стаття не знайдена",
      description: "Стаття не знайдена або видалена.",
    };
  }
}

const ArticlePage = async ({ params }: Props) => {
  const { articleId } = await params;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!articleId) {
    notFound();
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["article", articleId],
      queryFn: () => fetchArticleById(articleId, false, cookieHeader),
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleDetailsClient articleId={articleId} />
    </HydrationBoundary>
  );
};

export default ArticlePage;
