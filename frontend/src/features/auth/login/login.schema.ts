// frontend\src\features\auth\login\login.schema.ts

import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .max(64, "Email має містити не більше 64 символів")
    .email("Введіть коректну електронну адресу")
    .required("Email є обов’язковим"),

  password: Yup.string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(64, "Пароль має містити не більше 64 символів")
    .required("Пароль є обов’язковим"),
});
