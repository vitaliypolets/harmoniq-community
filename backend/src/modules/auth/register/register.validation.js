import multer from "multer";
import { z } from "zod";
import { HttpError } from "../../../utils/HttpError.js";

export const NAME_REGEXP = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'\s-]+$/;
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const registerBodySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .refine((val) => NAME_REGEXP.test(val), {
      message: "Invalid name format",
    }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .max(64, "Email must be at most 64 characters")
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .refine((val) => PASSWORD_REGEXP.test(val), {
      message: "Invalid password format",
    }),
});

export const checkEmailBodySchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .max(64, "Email must be at most 64 characters")
    .email("Invalid email format"),
});

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    return next(new HttpError(400, "Validation error", result.error.flatten().fieldErrors));
  }
  req.body = result.data;
  next();
};

const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_AVATAR_SIZE = 1 * 1024 * 1024;

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.mimetype)) {
      return cb(new HttpError(400, "Invalid file type. Only JPEG, PNG and WebP are allowed."));
    }
    cb(null, true);
  },
});
