import type { Request, Response } from 'express';
import { MonitorService } from './monitor.service.js';
import type { InputMonitor } from './monitor.types.js'; 
import { BadRequestError } from '../../utils/errors.js';

export class MonitorController {
    private readonly monitorService: MonitorService;

    constructor(monitorService: MonitorService) {
        this.monitorService = monitorService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const monitors = await this.monitorService.getAll();
        res.status(200).json({ success: true, data: monitors });
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const monitor = await this.monitorService.getById(id);
        res.status(200).json({ success: true, data: monitor });
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const monitorData : InputMonitor = {
            userId: req.body.userId,
            periodicityId: req.body.periodicityId,
            name: req.body.name,
            description: req.body.description,
            url: req.body.url
        };

        const createdMonitor = await this.monitorService.create(monitorData); 
        res.status(201).json({ success: true, data: createdMonitor });
    }   
}