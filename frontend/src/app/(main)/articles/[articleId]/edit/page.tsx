import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container/Container";
import { AuthGuard } from "@/features/auth/session";
import EditArticleForm from "@/features/articles/edit/components/EditArticleForm/EditArticleForm";

import styles from "./EditArticlePage.module.css";

type Props = {
  params: Promise<{ articleId: string }>;
};

export const metadata: Metadata = {
  title: "Edit article",
  description: "Edit your article in Harmoniq.",
};

const EditArticlePage = async ({ params }: Props) => {
  const { articleId } = await params;

  if (!articleId) {
    notFound();
  }

  return (
    <AuthGuard>
      <section>
        <Container className={styles.page}>
          <h1 className={styles.title}>Edit article</h1>
          <EditArticleForm articleId={articleId} />
        </Container>
      </section>
    </AuthGuard>
  );
};

export default EditArticlePage;