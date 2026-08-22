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
            <h2 className={styles.title}>Про нас</h2>
            <p className={styles.description}>
              Harmoniq Community — це платформа усвідомлених публікацій, присвячена ментальному здоров’ю та добробуту.
              Ми об’єднуємо авторів, мислителів і читачів, які вірять, що відкриті та змістовні
              історії можуть підтримувати, надихати й об’єднувати. Незалежно від того, чи хочете ви
              поділитися власним досвідом або навчитися в інших, тут є простір, щоб сповільнитися, осмислити й розвиватися.
            </p>
          </div>

          <div className={styles.lotusWrapper}>
            <Image src={lotusImg} alt="Квітка лотоса" className={styles.image} placeholder="blur" />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.friendsWrapper}>
            <Image
              src={friendsImg}
              alt="Друзі обіймаються на пагорбі під час заходу сонця"
              className={styles.image}
              placeholder="blur"
            />
          </div>

          <div className={styles.meditationWrapper}>
            <Image
              src={meditationImg}
              alt="Людина медитує"
              className={styles.image}
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
