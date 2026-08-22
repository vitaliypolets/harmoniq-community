// frontend\src\app\(auth)\login\page.tsx

import { GuestGuard } from '@/features/auth/session';
import styles from './LoginPage.module.css';
import LoginForm from '@/features/auth/login/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <GuestGuard>
      <section className={styles.page}>
        <h1 className={styles.loginTitle}>Login</h1>
        <LoginForm />
      </section>
    </GuestGuard>
  );
}
