// frontend\src\features\auth\login\components\LoginForm\LoginForm.tsx

"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../../login.schema";
import type { LoginFormValues } from "../../login.types";
import styles from "./LoginForm.module.css";
import { useState } from "react";
import { login } from "../../login.service";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import toast from "react-hot-toast";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const setSession = useAuthStore((state) => state.setSession);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values);

      setSession(result.user, result.accessToken);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your email and password.",
      );
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      <Form className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.labelLogin} htmlFor="email">
            Enter your email address
          </label>

          <Field
            className={styles.inputLogin}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="email@gmail.com"
          />

          <ErrorMessage className={styles.errorLogin} name="email" component="div" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.labelLogin} htmlFor="password">
            Enter a password
          </label>

          <div className={styles.passwordWrapper}>
            <Field
              className={styles.inputLogin}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="*********"
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg
                className={styles.passwordIcon}
                aria-hidden="true"
                focusable="false"
                width="24"
                height="24"
              >
                <use href={`/icons/sprite.svg#${showPassword ? "icon-eye" : "icon-eye-crossed"}`} />
              </svg>
            </button>
          </div>

          <ErrorMessage className={styles.errorLogin} name="password" component="div" />
        </div>

        <button className={styles.button} type="submit">
          Login
        </button>
        <p className={styles.instructionsLogin}>
          Don`t have an account?{" "}
          <Link className={styles.linkLogin} href="/register">
            Register
          </Link>
        </p>
      </Form>
    </Formik>
  );
}
