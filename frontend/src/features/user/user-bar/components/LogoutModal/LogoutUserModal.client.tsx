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
      toast.error("Failed to log out. Please try again.");
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
        <h3 className={css.title}>Are you sure?</h3>

        <p className={css.message}>We will miss you!</p>

        <div className={css.containerButtons}>
          <button
            type="button"
            className={css.buttonLogout}
            onClick={handleLogoutUser}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Log out"}
          </button>

          <button type="button" className={css.buttonCancel} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
