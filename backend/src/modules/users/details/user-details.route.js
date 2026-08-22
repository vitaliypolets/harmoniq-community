import { Router } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { getUserDetailsController } from './user-details.controller.js';
import { validateUserId } from './user-details.validation.js';

export const userDetailsRouter = Router();

// TODO (учасник №7): додайте методи, middleware та controller відповідно до API-контракту.
userDetailsRouter.get('/:userId', validateUserId, controllerWrapper(getUserDetailsController));
