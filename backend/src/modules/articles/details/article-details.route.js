import { Router } from 'express';

import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';

import { getArticleById } from './article-details.controller.js';
import { validateArticleParams } from './article-details.validation.js';
import { env } from '../../../config/env.js';
import { User } from '../../../models/User.js';
import { Session } from '../../../models/Session.js';

export const articleDetailsRouter = Router();

const optionalAuthenticate = async (req, _res, next) => {
  try {
    let userId = null;

    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      try {
        const payload = jwt.verify(token, env.accessTokenSecret);
        if (typeof payload === 'object' && payload.userId) {
          userId = payload.userId;
        }
      } catch {
        userId = null;
      }
    }

    const sessionId = req.cookies?.sessionId;

    if (!userId && sessionId && mongoose.isValidObjectId(sessionId)) {
      const session = await Session.findById(sessionId);
      
      if (session && session.expiresAt > new Date()) {
        userId = session.userId;
      }
    }

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in optionalAuthenticate:', error);
    next(error);
  }
}

articleDetailsRouter.get('/:articleId', validateArticleParams, optionalAuthenticate, getArticleById);
