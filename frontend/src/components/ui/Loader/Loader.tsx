import styles from "./Loader.module.css";

interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
