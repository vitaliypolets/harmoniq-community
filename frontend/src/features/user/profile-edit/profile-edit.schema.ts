import * as Yup from "yup";

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024;

export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

import { NAME_REGEXP } from '../../auth/register/register.schema'

export const nameSchema = Yup.string()
  .trim()
  .required("Ім’я є обов’язковим")
  .min(2, "Ім’я має містити щонайменше 2 символи")
  .max(32, "Ім’я має містити не більше 32 символів")
  .matches(NAME_REGEXP, "Ім’я не повинно містити цифр або спеціальних символів");

export const profileEditSchema = Yup.object({
  name: nameSchema,

  avatar: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Розмір аватара не повинен перевищувати 1 МБ",
      (file) => !file || (file instanceof File && file.size <= MAX_AVATAR_SIZE),
    )
    .test(
      "fileType",
      "Дозволені лише JPEG, PNG та WebP",
      (file) => !file || (file instanceof File && ALLOWED_AVATAR_MIME_TYPES.includes(file.type)),
    ),
});
