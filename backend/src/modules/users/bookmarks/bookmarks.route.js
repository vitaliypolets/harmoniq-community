import { Router } from 'express';

import { authenticate } from '../../../middlewares/authenticate.js';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import {
  addBookmarkController,
  getBookmarksController,
  removeBookmarkController,
} from './bookmarks.controller.js';
import {
  validateBookmarkBody,
  validateBookmarkParams,
  validateBookmarksQuery,
} from './bookmarks.validation.js';

export const bookmarksRouter = Router();

bookmarksRouter.get(
  '/me/bookmarks',
  authenticate,
  validateBookmarksQuery,
  controllerWrapper(getBookmarksController),
);

bookmarksRouter.post(
  '/me/bookmarks',
  authenticate,
  validateBookmarkBody,
  controllerWrapper(addBookmarkController),
);

bookmarksRouter.delete(
  '/me/bookmarks/:articleId',
  authenticate,
  validateBookmarkParams,
  controllerWrapper(removeBookmarkController),
);
