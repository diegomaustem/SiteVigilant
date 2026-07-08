import type { Request, Response } from 'express';
import type { LogService } from './log.service.js';

export class LogController {
    private readonly logService: LogService;

    constructor(logService: LogService) {
        this.logService = logService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const logs = await this.logService.getAll();
        res.status(200).json({ success: true, data: logs });
    }
}