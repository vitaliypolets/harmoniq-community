import { Router } from 'express';
import { getUsersListController } from './users-list.controller.js';

export const usersListRouter = Router();

usersListRouter.get('/', getUsersListController);

