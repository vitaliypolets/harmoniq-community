"use client";

import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { registerSchema, PASSWORD_REGEXP } from "../../register.schema";
import {
  saveRegisterDraft,
  getRegisterDraft,
  checkEmailAvailability,
  setRegisterPassword,
} from "../../register.service";
import type { RegisterFormValues } from "../../register.types";
import styles from "./RegisterForm.module.css";

const emptyValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_CHECK_DEBOUNCE_MS = 500;
const REVALIDATE_DEBOUNCE_MS = 400;

type StrengthLevel = "empty" | "weak" | "strong";

function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return "empty";
  return PASSWORD_REGEXP.test(password) ? "strong" : "weak";
}

const STRENGTH_LABEL: Record<StrengthLevel, string> = {
  empty: "",
  weak: "Weak",
  strong: "Strong",
};

export function capitalizeWords(value: string): string {
  if (!value) return "";
  return value.toLowerCase().replace(/(?:^|\s|-)\S/g, (match) => match.toUpperCase());
}

export function RegisterFormFields() {
  const {
    values,
    errors,
    isSubmitting,
    isValid,
    submitCount,
    setValues,
    setFieldValue,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormikContext<RegisterFormValues>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [emailDuplicate, setEmailDuplicate] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const emailCheckId = useRef(0);
  const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strength = getPasswordStrength(values.password);

  const isBlocked = (submitCount > 0 && !isValid) || emailDuplicate;

  useEffect(() => {
    const draft = getRegisterDraft();
    if (draft) {
      setValues({ ...emptyValues, ...draft, name: capitalizeWords(draft.name) }, false);
    }
    setIsHydrated(true);
  }, [setValues]);

  useEffect(() => {
    if (!isHydrated) return;
    saveRegisterDraft({ name: values.name, email: values.email });
  }, [values.name, values.email, isHydrated]);

  useEffect(() => {
    return () => {
      if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (submitCount === 0) return;

    const timeoutId = setTimeout(() => {
      validateForm();
    }, REVALIDATE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [values, submitCount, validateForm]);

  const runEmailCheck = async (email: string) => {
    const requestId = ++emailCheckId.current;
    setIsCheckingEmail(true);

    try {
      const isAvailable = await checkEmailAvailability(email);
      if (requestId !== emailCheckId.current) return;

      if (isAvailable) {
        setEmailDuplicate(false);
      } else {
        setEmailDuplicate(true);
        toast.error("User is already registered. Please go to the login page to sign in.");
      }
    } catch {
      if (requestId !== emailCheckId.current) return;
      setEmailDuplicate(false);
    } finally {
      if (requestId === emailCheckId.current) setIsCheckingEmail(false);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = capitalizeWords(event.target.value);
    setFieldValue("name", formatted);
  };

  const handleNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(event);
    setFieldValue("name", capitalizeWords(event.target.value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailDuplicate) setEmailDuplicate(false);
    handleChange(event);
  };

  const handleEmailBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    handleBlur(event);

    const email = event.target.value.trim();

    if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);

    if (!email) {
      setEmailDuplicate(false);
      return;
    }

    emailDebounceRef.current = setTimeout(() => {
      runEmailCheck(email);
    }, EMAIL_CHECK_DEBOUNCE_MS);
  };

  const nameStatusClass =
    submitCount > 0
      ? errors.name
        ? styles.inputError
        : values.name
          ? styles.inputSuccess
          : ""
      : "";

  const emailStatusClass = emailDuplicate
    ? styles.inputError
    : submitCount > 0
      ? errors.email
        ? styles.inputError
        : values.email
          ? styles.inputSuccess
          : ""
      : "";

  const passwordStatusClass =
    submitCount > 0
      ? errors.password
        ? styles.inputError
        : values.password
          ? styles.inputSuccess
          : ""
      : "";

  const confirmPasswordStatusClass =
    submitCount > 0
      ? errors.confirmPassword
        ? styles.inputError
        : values.confirmPassword
          ? styles.inputSuccess
          : ""
      : "";

  return (
    <Form className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="name">
          Enter your name
        </label>
        <Field
          className={`${styles.input} ${nameStatusClass}`}
          id="name"
          name="name"
          type="text"
          placeholder="Max"
          autoComplete="name"
          onChange={handleNameChange}
          onBlur={handleNameBlur}
        />
        {submitCount > 0 && errors.name && <p className={styles.error}>{errors.name}</p>}
        {submitCount > 0 && !errors.name && values.name && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Enter your email address
        </label>
        <Field
          className={`${styles.input} ${emailStatusClass}`}
          id="email"
          name="email"
          type="email"
          placeholder="email@gmail.com"
          autoComplete="email"
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
        />
        {isCheckingEmail && <p className={styles.success}>Checking email...</p>}
        {!isCheckingEmail && emailDuplicate && (
          <p className={styles.error}>Email is already registered</p>
        )}
        {!isCheckingEmail && !emailDuplicate && submitCount > 0 && errors.email && (
          <p className={styles.error}>{errors.email}</p>
        )}
        {!isCheckingEmail &&
          !emailDuplicate &&
          submitCount > 0 &&
          !errors.email &&
          values.email && <p className={styles.success}>Success</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Create a strong password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${passwordStatusClass}`}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use href={`/icons/sprite.svg#${showPassword ? "icon-eye" : "icon-eye-crossed"}`} />
            </svg>
          </button>
        </div>

        {submitCount > 0 && values.password && (
          <div className={styles.strength}>
            {(["weak", "strong"] as const).map((level) => {
              const isActive =
                (level === "weak" && strength !== "empty") ||
                (level === "strong" && strength === "strong");

              const activeClass = isActive
                ? styles[
                    `strengthBar${strength.charAt(0).toUpperCase()}${strength.slice(1)}` as keyof typeof styles
                  ]
                : "";

              return <span key={level} className={`${styles.strengthBar} ${activeClass}`} />;
            })}
            <span className={styles.strengthLabel}>{STRENGTH_LABEL[strength]}</span>
          </div>
        )}

        {submitCount > 0 && errors.password && <p className={styles.error}>{errors.password}</p>}
        {submitCount > 0 && !errors.password && values.password && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Repeat your password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${confirmPasswordStatusClass}`}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use
                href={`/icons/sprite.svg#${showConfirmPassword ? "icon-eye" : "icon-eye-crossed"}`}
              />
            </svg>
          </button>
        </div>
        {submitCount > 0 && errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
        {submitCount > 0 && !errors.confirmPassword && values.confirmPassword && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <Button
        className={styles.submitButton}
        variant="primary"
        size="md"
        type="submit"
        aria-disabled={isSubmitting || isBlocked}
        disabled={isSubmitting || isBlocked}
      >
        Create account
      </Button>

      <p className={styles.instructions}>
        Already have an account?{" "}
        <Link className={styles.link} href="/login">
          Log in
        </Link>
      </p>
    </Form>
  );
}

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = (values: RegisterFormValues) => {
    try {
      saveRegisterDraft({
        name: capitalizeWords(values.name.trim()),
        email: values.email,
      });
      setRegisterPassword(values.password);
      toast.success("Great! Now add a profile photo.");
      router.push("/photo");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Formik
      initialValues={emptyValues}
      validationSchema={registerSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      <RegisterFormFields />
    </Formik>
  );
}
