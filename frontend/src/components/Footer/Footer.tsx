'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Container } from '@/components/ui/Container';
import styles from './Footer.module.css';

const NAV_LINKS = [
  {
    label: 'Articles',
    href: '/articles',
  },
  {
    label: 'Account',
    href: '/profile',
  },
];

const AUTH_NAV_LINKS = [
  {
    label: 'Articles',
    href: '/articles',
  },
];

interface FooterProps {
  isAuthPage?: boolean;
}

export function Footer({ isAuthPage = false }: FooterProps) {
  const pathname = usePathname();

  const navLinks = isAuthPage ? AUTH_NAV_LINKS : NAV_LINKS;

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname !== href) {
      return;
    }

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogoClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (pathname !== '/') {
      return;
    }

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <Link
          href="/"
          className={styles.logoLink}
          aria-label="Harmoniq Home"
          onClick={handleLogoClick}
        >
          <svg
            className={styles.logoIcon}
            width={165}
            height={46}
          >
            <use href="/icons/sprite.svg#icon-logo" />
          </svg>
        </Link>

        <p className={styles.copyright}>
          © 2025 Harmoniq. All rights reserved.
        </p>

        <nav
          className={styles.nav}
          aria-label="Footer Navigation"
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={styles.navItem}
              >
                <Link
                  href={link.href}
                  className={styles.navLink}
                  scroll
                  onClick={(event) =>
                    handleNavClick(event, link.href)
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}