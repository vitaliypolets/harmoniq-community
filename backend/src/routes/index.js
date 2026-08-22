import { Router } from 'express';

import { healthRouter } from '../modules/health/health.route.js';

import { userArticlesRouter } from '../modules/users/articles/index.js';
import { userDetailsRouter } from '../modules/users/details/index.js';
import { usersListRouter } from '../modules/users/list/index.js';
import { meRouter } from '../modules/users/me/index.js';
import { bookmarksRouter } from '../modules/users/bookmarks/index.js';

import { loginRouter } from '../modules/auth/login/index.js';
import { registerRouter } from '../modules/auth/register/index.js';
import { sessionRouter } from '../modules/auth/session/index.js';

import { articlesListRouter } from '../modules/articles/list/index.js';
import { articleDetailsRouter } from '../modules/articles/details/index.js';
import { articleCreateRouter } from '../modules/articles/create/index.js';
import { articleManageRouter } from '../modules/articles/manage/index.js';

export const apiRouter = Router();

// Health
apiRouter.use('/health', healthRouter);

// Auth
apiRouter.use('/auth/login', loginRouter);
apiRouter.use('/auth/register', registerRouter);
apiRouter.use('/auth/session', sessionRouter);

// Users
apiRouter.use('/users/me', meRouter);
apiRouter.use('/users', usersListRouter);
apiRouter.use('/users', userDetailsRouter);
apiRouter.use('/users', userArticlesRouter);
apiRouter.use('/users', bookmarksRouter);

// Articles
apiRouter.use('/articles', articlesListRouter);
apiRouter.use('/articles', articleDetailsRouter);
apiRouter.use('/articles', articleCreateRouter);
apiRouter.use('/articles', articleManageRouter);

