import { UserRepository } from './user.repository.js';
import type { User, UpdateUser, UserResponse, InputUser } from './user.types.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';
import bcrypt from 'bcrypt';
export class UserService {
  constructor(private userRepository: UserRepository) {}

    async getAll(): Promise<UserResponse[]> {
        const users = await this.userRepository.getAll();
        return users.map(this.toResponse);
    }

    async getById(id: number): Promise<UserResponse> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }
        const user = await this.userRepository.getById(id);
        return this.toResponse(user);
    }

    async create(userData: InputUser): Promise<UserResponse> {
        if (!userData.email?.trim()) {
            throw new BadRequestError('E-mail é obrigatório.');
        }

        const userWithEmail = await this.userRepository.getByEmail(userData.email); 
        if (userWithEmail) {
            throw new ConflictError('Já existe um usuário cadastrado com este email. Escolha outro, por favor.');
        }

        return this.toResponse(await this.userRepository.create(userData));
    }

    async update(id: number, data: UpdateUser): Promise<UserResponse> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }

        const user = await this.userRepository.getById(id);
        
        if (data.email) {
            const email = await this.userRepository.getByEmail(data.email);
            if (email && user.id !== id) {
                throw new ConflictError('E-mail já está em uso por outro usuário. Tente outro.');
            }
        }
        
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.roleId) updateData.role_id = data.roleId;
        if (data.password) {
            updateData.password_hash = await bcrypt.hash(data.password, 10);
        }

        return this.toResponse(await this.userRepository.update(id, updateData));
    }

    async delete(id: number): Promise<void> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido.');
        }            
        await this.userRepository.delete(id);
    }

    private toResponse(user: User): UserResponse {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}