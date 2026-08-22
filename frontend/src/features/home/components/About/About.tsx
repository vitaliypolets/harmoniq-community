import Image from "next/image";

import { Container } from "@/components/ui/Container/Container";

import friendsImg from "./assets/about-friends.png";
import lotusImg from "./assets/about-lotus.png";
import meditationImg from "./assets/about-meditation.png";
import styles from "./About.module.css";

export const About = () => {
  return (
    <section className={styles.aboutSection}>
      <Container className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.textCard}>
            <h2 className={styles.title}>About us</h2>
            <p className={styles.description}>
              Harmoniq is a mindful publishing platform dedicated to mental health and well-being.
              We bring together writers, thinkers, and readers who believe that open, thoughtful
              stories can heal, inspire, and connect. Whether you’re here to share your journey or
              learn from others — this is your space to slow down, reflect, and grow.
            </p>
          </div>

          <div className={styles.lotusWrapper}>
            <Image src={lotusImg} alt="Lotus flower" className={styles.image} placeholder="blur" />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.friendsWrapper}>
            <Image
              src={friendsImg}
              alt="Friends embracing on a hill at sunset"
              className={styles.image}
              placeholder="blur"
            />
          </div>

          <div className={styles.meditationWrapper}>
            <Image
              src={meditationImg}
              alt="Person meditating"
              className={styles.image}
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
