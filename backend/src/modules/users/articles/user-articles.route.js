import { Router } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { getUserArticlesController } from './user-articles.controller.js';
import { validateUserArticlesRequest } from './user-articles.validation.js';

export const userArticlesRouter = Router();

userArticlesRouter.get('/:userId/articles', validateUserArticlesRequest, controllerWrapper(getUserArticlesController));
