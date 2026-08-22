"use client";

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal/Modal";
import { getAvatarSrc } from "@/utils/getAvatarSrc";
import { useAuthStore } from "@/store/auth.store";

import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_SIZE, nameSchema } from "../../profile-edit.schema";

import { updateMe } from "../../../me/me.service";

import styles from "./UserModal.module.css";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [name, setName] = useState(user?.name ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user?.name ?? "");
      setAvatarFile(null);
      setPreviewUrl(null);
      setError(null);
    }
  }, [isOpen, user?.name]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setName(user?.name ?? "");
    setAvatarFile(null);
    setPreviewUrl(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const validateName = (value: string): string | null => {
    try {
      nameSchema.validateSync(value);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Invalid name";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setError(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG and WebP are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar must be up to 1 MB");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setAvatarFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (isSubmitting) {
      return;
    }

    const nameError = validateName(trimmedName);

    if (nameError) {
      setError(nameError);
      return;
    }

    if (!avatarFile && trimmedName === (user?.name ?? "")) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("name", trimmedName);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updatedUser = await updateMe(formData);

      if (accessToken) {
        setSession(updatedUser, accessToken);
      }

      toast.success("Profile updated successfully");

      resetForm();
      onClose();
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? "Failed to update profile. Please try again.")
        : "Failed to update profile. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const trimmedName = name.trim();
  const nameError = validateName(trimmedName);
  const isNameValid = !nameError;

  const isNameChanged = trimmedName !== (user?.name ?? "");

  const canSave = isNameValid && (Boolean(avatarFile) || isNameChanged);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className={styles.userModalContent}>
        <h1 className={styles.userModalTitle}>Update your profile</h1>
        <button
          type="button"
          className={styles.avatarPicker}
          onClick={() => inputRef.current?.click()}
          aria-label="Choose avatar"
          disabled={isSubmitting}
        >
          <Image
            src={previewUrl ?? getAvatarSrc(user?.avatarUrl ?? null)}
            alt={previewUrl ? "Avatar preview" : "Current avatar"}
            className={styles.avatarImage}
            width={136}
            height={136}
            priority
            unoptimized={Boolean(previewUrl)}
          />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_AVATAR_MIME_TYPES.join(",")}
          className={styles.avatarFileInput}
          onChange={handleFileChange}
          disabled={isSubmitting}
        />
        <div className={styles.fieldGroup}>
          <label className={styles.nameLabel} htmlFor="user-name">
            Enter your name
          </label>
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            placeholder="Max"
            className={styles.nameInput}
            disabled={isSubmitting}
            maxLength={32}
            autoComplete="name"
          />
        </div>
        {error && <p className={styles.avatarError}>{error}</p>}
        <Button
          className={styles.avatarSaveButton}
          variant="primary"
          size="md"
          type="button"
          disabled={isSubmitting || !canSave}
          onClick={handleSave}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
