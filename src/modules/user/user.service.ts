import { UserRepository } from './user.repository.js';
import type { User, UpdateUser, UserResponse, InputUser } from './user.types.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';

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
        if (!user) throw new NotFoundError('Usuário não encontrado.');
        return this.toResponse(user);
    }

    async create(userData: InputUser): Promise<UserResponse> {
        try {
            const existingUser = await this.userRepository.getByEmail(userData.email); 
            if (existingUser) {
                throw new ConflictError('Já existe um usuário cadastrado com este email. Escolha outro, por favor.');
            }
            return this.toResponse(await this.userRepository.create(userData));
        } catch(error: any) {
            if (!(error instanceof ConflictError)) {
                console.error(`[UserService.create] Erro inesperado: ${error.message}`);
            }
            throw error;
        }
    }

    async update(id: number, data: UpdateUser): Promise<UserResponse> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestError('ID inválido. Deve ser um número inteiro.');
        }

        const existingUser = await this.userRepository.getById(id);
        if (!existingUser) throw new NotFoundError('Usuário não encontrado para atualização.');
        

        if (data.email) {
            const existingEmail = await this.userRepository.getByEmail(data.email);
            if (existingEmail && existingUser.id !== id) {
                throw new ConflictError('E-mail já está em uso por outro usuário. Tente outro.');
            }
        }

        return this.toResponse(await this.userRepository.update(id, data));
    }

    async delete(id: number): Promise<boolean> {
        const existingUser = await this.userRepository.getById(id); 
        if(!existingUser) throw new NotFoundError('Usuário não encontrado para deleção.');
            
        return await this.userRepository.delete(id);
    }

    private toResponse(user: User): UserResponse {
        const { passwordHash, ...rest } = user;
        return rest;
    }
}