'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ProfileTab, ProfileTabsProps } from '../../profile.types';
import styles from './ProfileTabs.module.css';

const tabs: Array<{ value: ProfileTab; label: string }> = [
  { value: 'my-articles', label: 'My Articles' },
  { value: 'saved-articles', label: 'Saved Articles' },
];

const isProfileTab = (value: string | null): value is ProfileTab =>
  value === 'my-articles' || value === 'saved-articles';

export function ProfileTabs({ myArticles, savedArticles }: ProfileTabsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: ProfileTab = isProfileTab(requestedTab) ? requestedTab : 'my-articles';

  useEffect(() => {
    if (requestedTab === null || isProfileTab(requestedTab)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'my-articles');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, requestedTab, router, searchParams]);

  const getTabHref = (tab: ProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);

    return `${pathname}?${params.toString()}`;
  };

  const activeContent = activeTab === 'saved-articles' ? savedArticles : myArticles;

  return (
    <section className={styles.section}>
      <nav
        className={styles.tabs}
        aria-label="Profile article views"
      >
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Link
              key={tab.value}
              id={`profile-tab-${tab.value}`}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              href={getTabHref(tab.value)}
              scroll={false}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <section
        className={styles.content}
        aria-labelledby={`profile-tab-${activeTab}`}
        data-profile-slot={activeTab}
      >
        {activeContent}
      </section>
    </section>
  );
}
