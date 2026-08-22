import * as Yup from "yup";

// 1. Регулярний вираз для імені (лише літери різних алфавітів, пробіли та дефіси)
export const NAME_REGEXP = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'\s-]+$/;

// 2. Регулярний вираз для email: локальна частина @ домен . TLD (мінімум 2 символи)
export const EMAIL_REGEXP =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

// 3. Регулярний вираз для складності пароля (мінімум 1 велика, 1 мала, 1 цифра, 1 спецсимвол)
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .matches(NAME_REGEXP, "Name must not contain numbers or special characters"),

  email: Yup.string()
    .trim()
    .required("Email is required")
    .max(64, "Email must be at most 64 characters")
    .matches(EMAIL_REGEXP, "Invalid email format"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .matches(
      PASSWORD_REGEXP,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    ),

  confirmPassword: Yup.string()
    .required("Please repeat your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
