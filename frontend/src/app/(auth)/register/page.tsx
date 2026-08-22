import styles from './RegisterPage.module.css';
import { RegisterForm } from '@/features/auth/register';

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>Join our community of mindfulness and wellbeing!</p>
        <RegisterForm />
      </div>
    </div>
  );
}
