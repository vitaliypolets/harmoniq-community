// TODO (учасник №5): controllers

import { Router } from "express";

import { getMe, updateMe } from "./me.controller.js";
import { validateUpdateMe } from "./me.validation.js";

import { upload } from "../../../middlewares/upload.js";
import { authenticate } from "../../../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, getMe);

router.patch("/", authenticate, upload.single("avatar"), validateUpdateMe, updateMe);

export { router as meRouter };
