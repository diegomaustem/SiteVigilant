import type { Request, Response } from 'express';
import { BadRequestError } from '../../utils/errors.js';
import type { UserService } from './user.service.js';
import type { InputUser, UpdateUser, User } from './user.types.js';

export class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAll();
        res.json({ success: true, data: users });
    } 

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const user = await this.userService.getById(id);
        res.status(200).json({ success: true, data: user });
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const userData: InputUser = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
            role_id: req.body.role_id
        };

        const user = await this.userService.create(userData);
        res.status(201).json({ success: true, message: 'Usuário criado com sucesso.', data: user });
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const updateData : UpdateUser = {
            name: req.body.name,
            email: req.body.email,
            role_id: req.body.role_id,
            password: req.body.password
        };

        const userUpdated = await this.userService.update(id, updateData);
        res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso.', data: userUpdated });
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await this.userService.delete(id);
        res.status(200).json({ success: true, message: 'Usuário deletado com sucesso.' });
    }
}