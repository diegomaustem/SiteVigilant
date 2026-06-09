import type { Request, Response } from 'express';
import { MonitorService } from './monitor.service.js';
import type { InputMonitor } from './monitor.types.js'; 

export class MonitorController {
    private readonly monitorService: MonitorService;

    constructor(monitorService: MonitorService) {
        this.monitorService = monitorService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const monitors = await this.monitorService.getAll();
            res.status(200).json({ success: true, data: monitors });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const monitorData : InputMonitor = {
                periodicityId: req.body.periodicityId,
                name: req.body.name,
                description: req.body.description,
                url: req.body.url
            };

            const createdMonitor = await this.monitorService.create(monitorData); 
            res.status(201).json({ success: true, data: createdMonitor });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }   
}