import type { Request, Response } from 'express';
import { PeriodicityService } from './periodicity.service.js';
import type { InputPeriodicity } from './periodicity.types.js';
import { BadRequestError } from '../../utils/errors.js';
import type { UpdateUser } from '../user/user.types.js';

export class PeriodicityController {
    private readonly periodicityService: PeriodicityService;

    constructor(periodicityService: PeriodicityService) {
        this.periodicityService = periodicityService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const periodicities = await this.periodicityService.getAll();
        res.status(200).json({ success: true, data: periodicities });
    } 

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const periodicity = await this.periodicityService.getById(id);
        res.status(200).json({ success: true, data: periodicity });
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const periodicityData : InputPeriodicity = {
            time: req.body.time,
            status: req.body.status
        };

        const createdPeriodicity = await this.periodicityService.create(periodicityData);
        res.status(201).json({ success: true, message: 'Periodicidade criada com sucesso.', data: createdPeriodicity });
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updateData : InputPeriodicity = {
            time: req.body.time,
            status: req.body.status,
        };
    
        const periodicityUpdated = await this.periodicityService.update(id, updateData);
        res.status(200).json({ success: true, message: 'Periodicidade atualizada com sucesso.', data: periodicityUpdated });
    }
    
    delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.periodicityService.delete(id);
        res.status(200).json({ success: true, message: 'Periodicidade deletada com sucesso.' });
    }
}