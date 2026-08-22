import { Router } from "express";

import { controllerWrapper } from "../../../middlewares/controllerWrapper.js";
import { checkEmailController, registerController } from "./register.controller.js";
import {
  avatarUpload,
  checkEmailBodySchema,
  registerBodySchema,
  validateBody,
} from "./register.validation.js";

export const registerRouter = Router();

const registerOrCheckEmail = (req, res, next) => {
  if (req.query.mode !== "check-email") {
    return next();
  }

  validateBody(checkEmailBodySchema)(req, res, (error) => {
    if (error) return next(error);

    controllerWrapper(checkEmailController)(req, res, next);
  });
};

registerRouter.post(
  "/",
  registerOrCheckEmail,
  avatarUpload.single("avatar"),
  validateBody(registerBodySchema),
  controllerWrapper(registerController),
);
