"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Container } from "@/components/ui/Container/Container";
import { Loader } from "@/components/ui/Loader/Loader";
import { getAvatarSrc } from "@/utils/getAvatarSrc";

import { getTopCreators } from "../../home.service";
import styles from "./TopCreators.module.css";

export const TopCreators = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topCreators"],
    queryFn: getTopCreators,
  });

  if (isLoading) {
    return (
      <div className={styles.centerContainer}>
        <Loader />
      </div>
    );
  }

  const creators = data?.data.items;

  if (isError || !creators?.length) {
    return null;
  }

  return (
    <section className={styles.section} id="top-creators">
      <Container className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Top Creators</h2>
          <Link href="/authors" className={styles.link}>
            Go to all Creators <span className={styles.arrow}>↗</span>
          </Link>
        </div>

        <ul className={styles.list}>
          {creators.map((creator) => (
            <li key={creator.id} className={styles.item}>
              <div className={styles.avatarWrapper}>
                <Image
                  src={getAvatarSrc(creator.avatarUrl)}
                  alt={creator.name}
                  fill
                  sizes="(min-width: 1440px) 160px, (min-width: 768px) 160px, 148px"
                  className={styles.avatar}
                />
              </div>
              <h3 className={styles.name}> {creator.name.trim().split(/\s+/)[0].slice(0, 10)}</h3>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
