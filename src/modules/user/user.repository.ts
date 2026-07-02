import type { Knex } from 'knex';
import type { User, InputUser, UpdateUser} from './user.types.js'
import bcrypt from 'bcrypt';

export class UserRepository {
    private db: Knex;
    private readonly userTable = 'users';

    constructor(db: Knex) {
        this.db = db;
    }

    async getAll(): Promise<User[]> {
        try {
          return await this.db<User>(this.userTable).select('*');
        } catch (error: any) {
          console.error(`[UserRepository.getAll] Erro ao buscar usuários: ${error.message}`);
          throw error;
        }
    }

    async getById(id: number): Promise<User | undefined> {
        try {
            const user = await this.db(this.userTable).where({ id }).first();
            if (!user) return undefined;
            return user; 
        } catch(error: any) {
            console.error(`[UserRepository.getById] Erro ao buscar usuário por id: ${error.message}`);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<User | undefined> {
        try {
            const user = await this.db(this.userTable).where({ email }).first();
            if (!user) return undefined;

            return user;
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
                role_id: userData.role_id
            })
            .returning('*');
            return user;
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
            if (data.role_id) updateData.role = data.role_id; 
            if (data.password) {
                updateData.password_hash = await bcrypt.hash(data.password, 10);
            }

            const [updated] = await this.db(this.userTable)
                .where({ id })
                .update(updateData)
                .returning('*');

            return updated;
        } catch(error: any) {
            console.error(`[UserRepository.update] Erro ao atualizar usuário: ${error.message}`);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deleted = await this.db(this.userTable).where({ id }).del();
            return deleted > 0;
        } catch(error: any) {
            console.error(`[UserRepository.delete] Erro ao deletar usuário: ${error.message}`);
            throw error;
        }
    }
}