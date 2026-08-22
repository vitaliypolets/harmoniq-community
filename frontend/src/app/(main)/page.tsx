import styles from "./HomePage.module.css";

import { Hero } from "@/features/home/components/Hero/Hero";
import { About } from "@/features/home/components/About/About";
import { PopularArticles } from "@/features/home/components/PopularArticles/PopularArticles";
import { TopCreators } from "@/features/home/components/TopCreators/TopCreators";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <About />
      <PopularArticles />
      <TopCreators />
    </div>
  );
}
