"use client";
import { AuthorArticles } from "@/features/authors/author-articles";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Container } from "@/components/ui/Container";
import styles from "./AuthorPage.module.css";

import { getAuthorById } from "@/features/authors/authors.service";
import type { PublicUser } from "@/types/user";
import { getAvatarSrc } from "@/utils/getAvatarSrc";
import { useRouter } from "next/navigation";

type AuthorPageProps = {
  params: Promise<{ userId: string }>;
};

export default function AuthorPage({ params }: AuthorPageProps) {
  const router = useRouter();
  const [author, setAuthor] = useState<PublicUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        const { userId } = await params;

        setUserId(userId);

        const data = await getAuthorById(userId);
        setAuthor(data);
      } catch {
        toast.error("Не вдалося завантажити автора", {
          id: "author-load-error",
        });
        router.replace("/authors");
      }
    };

    loadAuthor();
  }, [params, router]);

  if (!author || !userId) {
    return "Loading...";
  }

  const firstName = author.name.split(" ")[0];

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.avatarWrapper}>
            <Image
              src={getAvatarSrc(author.avatarUrl)}
              alt={author.name}
              fill
              loading="eager"
              className={styles.avatar}
              sizes="(min-width: 768px) 137px, 124px"
            />
          </div>
          <div className={styles.user_info}>
            <h1 className={styles.name}>{firstName}</h1>
            <p className={styles.articles}>{author.articlesAmount} articles</p>
          </div>
        </div>
        <AuthorArticles userId={userId} author={author} />
      </Container>
    </section>
  );
}
