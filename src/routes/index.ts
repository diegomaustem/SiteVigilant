import { Router } from 'express';
import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/rate-limit.middleware.js';
import { AuthValidator } from '../validators/auth-validator.js';

import { authController, monitorController, userController } from '../config/container.js';
import { MonitorValidator } from '../validators/monitor-validator.js';
import { periodicityController } from '../config/container.js';
import { PeriodicityValidator } from '../validators/periodicity-validator.js';
import { authService } from '../config/container.js';

const authGuard = authMiddleware(authService);
const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API running', timestamp: new Date() });
});

router.post('/register', registerLimiter, AuthValidator.validateRegister, asyncHandler(authController.register));
router.post('/login', loginLimiter, AuthValidator.validateLogin, asyncHandler(authController.login));

router.get('/list-monitors', authGuard, asyncHandler(monitorController.getAll));
router.get('/list-monitor/:id', authGuard, asyncHandler(monitorController.getById));
router.post('/create-monitor', authGuard, MonitorValidator.validateCheckInput, asyncHandler(monitorController.create));

router.get('/periodicities', authGuard, asyncHandler(periodicityController.getAll));
router.get('/periodicity/:id', authGuard, asyncHandler(periodicityController.getById)); 
router.post('/periodicity', authGuard, PeriodicityValidator.validateCheckInput, asyncHandler(periodicityController.create));
router.put('/periodicity/:id', authGuard, PeriodicityValidator.validateCheckInput, asyncHandler(periodicityController.update));
router.delete('/periodicity/:id', authGuard, asyncHandler(periodicityController.delete));

router.get('/users', authGuard, asyncHandler(userController.getAll));
router.get('/user/:id', authGuard, asyncHandler(userController.getById));
router.post('/user', authGuard, asyncHandler(userController.create));
router.put('/user/:id', authGuard, asyncHandler(userController.update));
router.delete('/user/:id', authGuard, asyncHandler(userController.delete));

export default router;