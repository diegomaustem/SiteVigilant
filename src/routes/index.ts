import { Router } from 'express';
import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';

import { monitorController } from '../config/container.js';
import { MonitorValidator } from '../middlewares/monitor-validator.middleware.js';

import { periodicityController } from '../config/container.js';

const router: Router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API running', timestamp: new Date() });
});

router.get('/list-monitors', asyncHandler(monitorController.getAll));
router.post('/create-monitor', MonitorValidator.validateCheckInput, asyncHandler(monitorController.create));

router.get('/list-periodicities', periodicityController.getAll); 
router.post('/create-periodicity', periodicityController.create);

export default router;