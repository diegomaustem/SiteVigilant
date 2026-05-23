import { Router } from 'express';
import type { Request, Response } from 'express';

const router: Router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

export default router;