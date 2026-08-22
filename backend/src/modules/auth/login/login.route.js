// backend/src/modules/auth/login/login.route.js

import { Router } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { loginController } from './login.controller.js';

export const loginRouter = Router();

loginRouter.post('/', controllerWrapper(loginController));
