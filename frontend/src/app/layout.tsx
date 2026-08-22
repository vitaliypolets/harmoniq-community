import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans, Manrope, Merienda, Noto_Sans } from 'next/font/google';

import { AppProviders } from '@/components/providers/AppProviders';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--next-font-manrope',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--next-font-dm-sans',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--next-font-noto-sans',
  display: 'swap',
});

const merienda = Merienda({
  subsets: ['latin'],
  variable: '--next-font-merienda',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Harmoniq',
    template: '%s | Harmoniq',
  },
  description: 'Find your harmony in community.',
  openGraph: {
    title: 'Harmoniq',
    description: 'Find your harmony in community.',
    url: 'https://harmoniq.com',
    siteName: 'Harmoniq',
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${dmSans.variable} ${notoSans.variable} ${merienda.variable}`}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
