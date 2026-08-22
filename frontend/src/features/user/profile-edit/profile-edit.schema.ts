import * as Yup from "yup";

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024;

export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

import { NAME_REGEXP } from '../../auth/register/register.schema'

export const nameSchema = Yup.string()
  .trim()
  .required("Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(32, "Name must be at most 32 characters")
  .matches(NAME_REGEXP, "Name must not contain numbers or special characters");

export const profileEditSchema = Yup.object({
  name: nameSchema,

  avatar: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Avatar must be up to 1 MB",
      (file) => !file || (file instanceof File && file.size <= MAX_AVATAR_SIZE),
    )
    .test(
      "fileType",
      "Only JPEG, PNG and WebP are allowed",
      (file) => !file || (file instanceof File && ALLOWED_AVATAR_MIME_TYPES.includes(file.type)),
    ),
});
