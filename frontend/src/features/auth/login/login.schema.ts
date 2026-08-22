// frontend\src\features\auth\login\login.schema.ts

import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .max(64, "Email must be at most 64 characters")
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .required("Password is required"),
});
