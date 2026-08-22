import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../../../config/env.js';
import { Session } from '../../../models/Session.js';
import { getArticlesListController } from './articles-list.controller.js';

export const articlesListRouter = Router();

const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        req.user = jwt.verify(token, env.accessTokenSecret);
        return next();
      } catch {
        req.user = null;
      }
    }

    const sessionId = req.cookies?.sessionId;
    if (sessionId && mongoose.isValidObjectId(sessionId)) {
      const session = await Session.findById(sessionId).select('userId expiresAt').lean();
      if (session && new Date(session.expiresAt) > new Date()) {
        req.user = { userId: session.userId.toString() };
        return next();
      }
    }

    req.user = null;
  } catch {
    req.user = null;
  }

  next();
};

articlesListRouter.get('/', optionalAuth, getArticlesListController);

// export const articlesListRouter = Router();

// // TODO (учасник №11): додайте методи, middleware та controller відповідно до API-контракту.
// articlesListRouter.use((_req, res) => {
//   res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
// });
