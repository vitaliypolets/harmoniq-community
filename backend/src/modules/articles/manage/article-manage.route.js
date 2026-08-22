// TODO (учасник №12): додайте методи, middleware та controller відповідно до API-контракту.

import { Router } from 'express';

import { authenticate } from '../../../middlewares/authenticate.js';
import { articleUpload } from '../../../middlewares/articleUpload.js';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { deleteArticleController, updateArticleController } from './article-manage.controller.js';
import { validateUpdateArticle } from './article-manage.validation.js';

export const articleManageRouter = Router();

articleManageRouter.patch(
  '/:articleId',
  authenticate,
  articleUpload.single('image'),
  validateUpdateArticle,
  controllerWrapper(updateArticleController),
);

articleManageRouter.delete('/:articleId', authenticate, controllerWrapper(deleteArticleController));
