import styles from './RegisterPage.module.css';
import { RegisterForm } from '@/features/auth/register';

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Зареєструватися</h1>
        <p className={styles.subtitle}>Приєднуйтеся до нашої спільноти усвідомленості та добробуту!</p>
        <RegisterForm />
      </div>
    </div>
  );
}
