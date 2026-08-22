import Image from 'next/image';
import Link from 'next/link';

import type { PublicUser } from '@/types/user';
import { getAvatarSrc } from '@/utils/getAvatarSrc';
import styles from './AuthorsItem.module.css';

type AuthorsItemProps = {
  author: PublicUser;
};

export default function AuthorsItem({ author }: AuthorsItemProps) {
  const firstName = author.name.split(' ')[0];
const displayedName = firstName.length > 10 ? `${firstName.slice(0, 8)}...` : firstName;
  return (
    <Link href={`/authors/${author.id}`} className={styles.item}>
      <div className={styles.avatarWrapper}>
    <Image
      src={getAvatarSrc(author.avatarUrl)}
      alt={author.name}
      fill
      loading="eager"
      className={styles.avatar}
      sizes="(min-width: 768px) 262px, 148px"
    />
  </div>
      <p className={styles.name}>{displayedName}</p>
    </Link>
  );
}
