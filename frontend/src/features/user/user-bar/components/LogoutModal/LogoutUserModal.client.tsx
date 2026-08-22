"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Modal from "@/components/ui/Modal/Modal";
import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/features/auth/session/session.service";

import css from "./LogoutUserModal.module.css";

interface LogoutUserModalClientProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutUserModalClient({ isOpen, onClose }: LogoutUserModalClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clearIsAuthenticated = useAuthStore((state) => state.clearSession);

  const handleLogoutUser = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Не вдалося вийти. Спробуйте ще раз.");
    } finally {
      clearIsAuthenticated();
      onClose();
      router.push("/");
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={css.container}>
        <h3 className={css.title}>Ви впевнені?</h3>

        <p className={css.message}>Ми будемо сумувати за вами!</p>

        <div className={css.containerButtons}>
          <button
            type="button"
            className={css.buttonLogout}
            onClick={handleLogoutUser}
            disabled={isLoading}
          >
            {isLoading ? "Вихід..." : "Вийти"}
          </button>

          <button type="button" className={css.buttonCancel} onClick={onClose} disabled={isLoading}>
            Скасувати
          </button>
        </div>
      </div>
    </Modal>
  );
}
