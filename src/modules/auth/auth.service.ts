import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository.js';
import type { UserResponse } from '../user/user.types.js';
import { UnauthorizedError, ConflictError } from '../../utils/errors.js';
import { ENV } from '../../config/env.js';

export class AuthService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async register(email: string, password: string, name: string): Promise<UserResponse> {
        const existingUser = await this.userRepository.getByEmail(email);
        if (existingUser) {
        throw new ConflictError('E-mail já cadastrado. Por favor, tente outro.');
        }

        const user = await this.userRepository.create({ email, password, name });
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }

    async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
        const user = await this.userRepository.getByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Credenciais inválidas.Veifique seu usuário e senha');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            ENV.JWT_SECRET,
            { expiresIn: ENV.JWT_DURATION }
        );

        return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        },
        token,
        };
    }

    verifyToken(token: string): { userId: number; email: string; name: string } {
        try {
            return jwt.verify(token, ENV.JWT_SECRET) as any;
        } catch {
            throw new UnauthorizedError('Token inválido ou expirado');
        }
    }
}