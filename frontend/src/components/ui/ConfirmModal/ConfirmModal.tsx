import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Видалення статті",
  description = "Ви впевнені, що хочете видалити цю статтю?",
  confirmText = "Видалити",
  cancelText = "Скасувати",
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Видалення..." : confirmText}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
