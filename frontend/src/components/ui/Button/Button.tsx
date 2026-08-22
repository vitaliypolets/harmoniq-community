'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type BaseProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps> & {
    href?: never;
  };

type LinkButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & {
    href: string;
  };

type Props = ButtonProps | LinkButtonProps;

// 1. Named Export (для index.ts та нових компонентів)
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: Props) {
  const classNames = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  if ('href' in props && props.href) {
    return (
      <Link
        {...(props as LinkButtonProps)}
        className={classNames}
      >
        {children}
      </Link>
    );
  }

  const { type = 'button', ...buttonProps } = props as ButtonProps;

  return (
    <button
      type={type}
      {...buttonProps}
      className={classNames}
    >
      {children}
    </button>
  );
}

// 2. Default Export (для сумісності зі старими імпортами у develop)
export default Button;
