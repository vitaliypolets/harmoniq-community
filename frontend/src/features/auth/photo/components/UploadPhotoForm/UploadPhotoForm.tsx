"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import Modal from "@/components/ui/Modal/Modal";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarSrc } from "@/utils/getAvatarSrc";
import {
  getRegisterDraft,
  clearRegisterDraft,
  getRegisterPassword,
  clearRegisterPassword,
} from "@/features/auth/register";
import { registerUser } from "../../photo.service";
import { ALLOWED_AVATAR_MIME_TYPES, MAX_AVATAR_SIZE } from "../../photo.schema";
import styles from "./UploadPhotoForm.module.css";

const ERROR_REDIRECT_DELAY_MS = 4000;

export default function UploadPhotoForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedRef = useRef(false);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!getRegisterDraft() || !getRegisterPassword()) {
      router.replace("/register");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setAvatarFile(null);
      setPreviewUrl(null);
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

    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const completeRegistration = async (file: File | null) => {
    if (completedRef.current) return;

    const draft = getRegisterDraft();
    const password = getRegisterPassword();

    if (!draft || !password) {
      router.replace("/register");
      return;
    }

    completedRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await registerUser({
        name: draft.name,
        email: draft.email,
        password,
        avatar: file,
      });

      setSession(result.user, result.accessToken);
      clearRegisterDraft();
      clearRegisterPassword();
      toast.success("Welcome to Harmoniq!");
      router.replace("/");
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? "Registration failed. Please try again.")
        : "Registration failed. Please try again.";

      toast.error(message, { duration: ERROR_REDIRECT_DELAY_MS });

      redirectTimeoutRef.current = setTimeout(() => {
        router.replace("/register");
      }, ERROR_REDIRECT_DELAY_MS);
    }
  };

  const handleClose = () => {
    completeRegistration(null);
  };

  return (
    <Modal isOpen onClose={handleClose} backdrop="transparent">
      {isSubmitting && <Loader label="Saving..." />}

      <div className={styles.content}>
        <h1 className={styles.title}>Upload your photo</h1>

        <button
          type="button"
          className={styles.avatarButton}
          onClick={() => inputRef.current?.click()}
          aria-label="Choose avatar"
        >
          <Image
            src={previewUrl ?? getAvatarSrc(null)}
            alt={previewUrl ? "Avatar preview" : "Default avatar"}
            className={styles.avatarPreview}
            width={136}
            height={136}
            priority
          />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_AVATAR_MIME_TYPES.join(",")}
          className={styles.fileInput}
          onChange={handleFileChange}
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button
          className={styles.saveButton}
          variant="primary"
          size="md"
          type="button"
          disabled={isSubmitting || !avatarFile}
          onClick={() => completeRegistration(avatarFile)}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
