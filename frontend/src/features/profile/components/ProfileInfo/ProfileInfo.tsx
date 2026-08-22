'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getAvatarSrc } from '@/utils/getAvatarSrc';

import type { ProfileInfoProps } from '../../profile.types';
import styles from './ProfileInfo.module.css';

export function ProfileInfo({
  name,
  avatarUrl,
  articlesAmount,
}: ProfileInfoProps) {
  const fallbackAvatar = getAvatarSrc(null);
  const [avatarSrc, setAvatarSrc] = useState(getAvatarSrc(avatarUrl));

  useEffect(() => {
    setAvatarSrc(getAvatarSrc(avatarUrl));
  }, [avatarUrl]);

  const articlesLabel = `${articlesAmount} ${articlesAmount === 1 ? 'article' : 'articles'}`;

  return (
    <section
      className={styles.profile}
      aria-label="Profile information"
    >
      <Image
        className={styles.avatar}
        src={avatarSrc}
        alt={`${name} profile photo`}
        width={96}
        height={96}
        sizes="(min-width: 768px) 96px, 72px"
        loading="eager"
        onError={() => {
          if (avatarSrc !== fallbackAvatar) setAvatarSrc(fallbackAvatar);
        }}
      />

      <div className={styles.details}>
        <h2 className={styles.name}>{name}</h2>
        <p
          className={styles.count}
          aria-live="polite"
        >
          {articlesLabel}
        </p>
      </div>
    </section>
  );
}
