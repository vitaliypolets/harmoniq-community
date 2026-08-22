import * as Yup from "yup";

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024;
export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const photoSchema = Yup.object({
  avatar: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Розмір аватара не повинен перевищувати 1 МБ",
      (file) => !file || (file as File).size <= MAX_AVATAR_SIZE,
    )
    .test(
      "fileType",
      "Дозволені лише JPEG, PNG та WebP",
      (file) => !file || ALLOWED_AVATAR_MIME_TYPES.includes((file as File).type),
    ),
});
