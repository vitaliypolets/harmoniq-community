'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { MouseEvent } from 'react';

import type { ModalErrorSaveProps } from '../../article-shared.types';
import styles from './ModalErrorSave.module.css';

export const ModalErrorSave = ({
  title = 'Помилка під час збереження',
  description,
  onClose,
}: ModalErrorSaveProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-error-save-title"
        aria-describedby="modal-error-save-description"
      >
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Закрити">
          <svg className={styles.closeIcon} width="20" height="20" aria-hidden="true">
            <use href="/icons/sprite.svg#icon-close" />
          </svg>
        </button>

        <h2 className={styles.title} id="modal-error-save-title">
          {title}
        </h2>

        <p className={styles.description} id="modal-error-save-description">
          {description}
        </p>

        <div className={styles.actions}>
          <Link className={`${styles.button} ${styles.loginButton}`} href="/login">
            Увійти
          </Link>

          <Link className={`${styles.button} ${styles.registerButton}`} href="/register">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
};
