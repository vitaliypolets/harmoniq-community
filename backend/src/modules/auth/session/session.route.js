import { Router } from 'express';
import { logoutSessionController, refreshSessionController } from './session.controller.js';
import { validateSessionCookies } from './session.validation.js';

export const sessionRouter = Router();

sessionRouter.post('/', validateSessionCookies, refreshSessionController);
sessionRouter.delete('/', logoutSessionController);
