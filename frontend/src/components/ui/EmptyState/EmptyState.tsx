import { Button } from "@/components/ui/Button";

import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <section className={styles.emptyState} aria-label={title}>
      <div className={styles.icon} aria-hidden="true">
        !
      </div>

      <h2 className={styles.title}>{title}</h2>

      <p className={styles.description}>{description}</p>

      <Button href={actionHref} variant="secondary" className={styles.action}>
        {actionLabel}
      </Button>
    </section>
  );
}

export default EmptyState;
