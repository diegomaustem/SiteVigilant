import type { Knex } from 'knex';
import type { User, InputUser, UpdateUser, UserResponse} from './user.types.js'
import bcrypt from 'bcrypt';
import { NotFoundError } from '../../utils/errors.js';

export class UserRepository {
    private db: Knex;
    private readonly userTable = 'users';

    constructor(db: Knex) {
        this.db = db;
    }

    async getAll(): Promise<User[]> {
        try {
          const users = await this.db<UserResponse>(this.userTable).select('*');
          return users.map(this.toDomain);
        } catch (error: any) {
          console.error(`[UserRepository.getAll] Erro ao buscar usuários: ${error.message}`);
          throw error;
        }
    }

    async getById(id: number): Promise<User | undefined> {
        try {
            const user = await this.db(this.userTable).where({ id }).first();
            if (!user) return undefined;
            return this.toDomain(user);
        } catch(error: any) {
            console.error(`[UserRepository.getById] Erro ao buscar usuário por id: ${error.message}`);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.db(this.userTable).where({ email }).first();
            if (!user) return undefined;

            return this.toDomain(user);
        } catch(error: any) {
            console.error(`[UserRepository.getByEmail] Erro ao buscar usuário por email: ${error.message}`);
            throw error;
        }
    }

    async create(userData: InputUser): Promise<User> {
        try { 
            const passwordHash = await bcrypt.hash(userData.password, 10);
            const [user] = await this.db(this.userTable)
            .insert({
                email: userData.email,
                name: userData.name,
                password_hash: passwordHash,
                role_id: userData.roleId
            })
            .returning('*');
            return this.toDomain(user);
        } catch(error: any) {
            console.error(`[UserRepository.create] Erro ao criar usuário: ${error.message}`);
            throw error;
        }
    }

    async update(id: number, data: UpdateUser): Promise<User> {
        try {
            const updateData: any = {};
            if (data.name) updateData.name = data.name;
            if (data.email) updateData.email = data.email;
            if (data.roleId) updateData.role_id = data.roleId;
            if (data.password) {
                updateData.password_hash = await bcrypt.hash(data.password, 10);
            }

            const [updated] = await this.db(this.userTable)
                .where({ id })
                .update(updateData)
                .returning('*');

            return this.toDomain(updated);
        } catch(error: any) {
            console.error(`[UserRepository.update] Erro ao atualizar usuário: ${error.message}`);
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const deleted = await this.db(this.userTable).where({ id }).del();
            if(deleted === 0) {
                throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
            }
        } catch(error: any) {
            console.error(`[UserRepository.delete] Erro ao deletar usuário: ${error.message}`);
            throw error;
        }
    }

    private toDomain(dbUser: any): User {
        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            passwordHash: dbUser.password_hash,
            roleId: dbUser.role_id ?? 0,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at,
        };
    }
}