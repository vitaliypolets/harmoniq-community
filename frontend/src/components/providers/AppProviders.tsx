'use client';

import { useEffect, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { restoreSession } from '@/features/auth/session/session.service';
import { useAuthStore } from '@/store/auth.store';

import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setRefreshing = useAuthStore((state) => state.setRefreshing);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let cancelled = false;

    async function restore() {
      setRefreshing(true);

      try {
        const session = await restoreSession();

        if (cancelled) return;

        setSession(session.user, session.accessToken);
      } catch {
        if (cancelled) return;

        clearSession();
      } finally {
        if (!cancelled) {
          setRefreshing(false);
          setInitialized(true);
        }
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, [setSession, clearSession, setRefreshing, setInitialized]);

  return (
    <QueryProvider>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </QueryProvider>
  );
}
