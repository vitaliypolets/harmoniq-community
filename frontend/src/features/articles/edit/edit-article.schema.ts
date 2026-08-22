import * as Yup from "yup";

const MAX_IMAGE_SIZE = 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const editArticleSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(48, "Title must contain at most 48 characters")
    .required("Title is required"),

  article: Yup.string()
    .trim()
    .min(100, "Article must contain at least 100 characters")
    .max(4000, "Article must contain at most 4000 characters")
    .required("Article is required"),

  image: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Image size must not exceed 1 MB", (value) => {
      if (!value) return true;

      return value.size <= MAX_IMAGE_SIZE;
    })
    .test("fileType", "Only JPEG, PNG and WEBP images are allowed", (value) => {
      if (!value) return true;

      return ALLOWED_IMAGE_TYPES.includes(value.type);
    }),

  publicationDate: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must have format YYYY-MM-DD")
    .required("Publication date is required"),
});
