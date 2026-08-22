"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import styles from "./Modal.module.css";

type ModalBackdrop = "dark" | "transparent";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  backdrop?: ModalBackdrop;
  title?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  backdrop = "dark",
  title, // 1. Отримуємо title
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const modalClasses = [styles.modalContent, className].filter(Boolean).join(" ");

  const backdropClasses = [
    styles.backdrop,
    backdrop === "transparent" && styles.backdropTransparent,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className={backdropClasses} onClick={onClose}>
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 5.25L12 12M12 12L5.25 18.75M12 12L18.75 18.75M12 12L18.75 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* 2. Рендеримо заголовок, якщо він переданий */}
        {title && <h2 className={styles.title}>{title}</h2>}

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
