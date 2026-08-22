"use client";

import Image from "next/image";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";

import heroBgDesktop from "./assets/hero-background.png";
import heroBgMobile from "./assets/hero-background-mobile.png";
import styles from "./Hero.module.css";

const ARTICLES_ANCHOR_ID = "popular-articles";

export const Hero = () => {
  const scrollToArticles = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const section = document.getElementById(ARTICLES_ANCHOR_ID);

    if (!section) {
      return;
    }

    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 0;

    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - headerHeight),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      `#${ARTICLES_ANCHOR_ID}`,
    );
  };

  return (
    <section className={styles.heroSection}>
      <Container className={styles.heroContainer}>
        <div className={styles.imageWrapperMobile}>
          <Image
            src={heroBgMobile}
            sizes="(max-width: 767px) 361px, (max-width: 1439px) 430px, 0px"
            alt="Person sitting peacefully in nature"
            priority
            fetchPriority="high"
            placeholder="blur"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={heroBgDesktop}
            sizes="(min-width: 1440px) 805px, 0px"
            alt="Person sitting peacefully in nature"
            priority
            fetchPriority="high"
            placeholder="blur"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            Find your{" "}
            <span className={styles.italic}>harmony</span>{" "}
            in community
          </h1>

          <div className={styles.buttons}>
            <Button
              href={`#${ARTICLES_ANCHOR_ID}`}
              variant="primary"
              size="xl"
              className={styles.heroButton}
              onClick={scrollToArticles}
            >
              Go to Articles
            </Button>

            <Button
              href="/register"
              variant="secondary"
              size="xl"
              className={`${styles.heroButton} ${styles.registerButton}`}
            >
              Register
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
