// frontend\src\features\auth\session\components\GuestGuard\GuestGuard.tsx

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { restoreSession } from '../../session.service';
import { useAuthStore } from '@/store/auth.store';

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const initializeSession = async () => {
      try {
        const session = await restoreSession();

        setSession(session.user, session.accessToken);
      } catch {
        // Користувач не авторизований.
      } finally {
        setInitialized(true);
      }
    };

    void initializeSession();
  }, [isInitialized, setInitialized, setSession]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
