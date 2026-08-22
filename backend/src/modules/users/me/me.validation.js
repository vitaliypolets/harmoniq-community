// TODO (учасник №5): request validation

import { z } from "zod";
import { HttpError } from "../../../utils/HttpError.js";

import { NAME_REGEXP } from '../../auth/register/register.validation.js'

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .regex(NAME_REGEXP, "Name must not contain numbers or special characters")
    .optional(),
});

export const validateUpdateMe = (req, _res, next) => {
  const result = updateMeSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new HttpError(400, "Validation error", details);
  }

  const hasName = result.data.name !== undefined;
  const hasAvatar = req.file !== undefined;

  if (!hasName && !hasAvatar) {
    throw new HttpError(400, "Validation error", [
      {
        field: "body",
        message: "At least name or avatar is required",
      },
    ]);
  }

  req.body = result.data;
  next();
};
