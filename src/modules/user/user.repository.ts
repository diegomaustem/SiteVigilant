import type { Knex } from 'knex';
import type { User, UpdateUser, UserResponse, UserCreate} from './user.types.js'
import { NotFoundError } from '../../utils/errors.js';

export class UserRepository {
    private db: Knex;
    private readonly userTable = 'users';

    constructor(db: Knex) {
        this.db = db;
    }

    async getAll(): Promise<User[]> {
        const users = await this.db<UserResponse>(this.userTable).select('*');
        return users.map(this.toDomain);
    }

    async getById(id: number): Promise<User> {
        const user = await this.db(this.userTable).where({ id }).first();
        if (!user) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
        }
        return this.toDomain(user);
    }
     
    async getByEmail(email: string): Promise<User | undefined> {
        const user = await this.db(this.userTable).where({ email }).first();
        if (!user) { 
           return undefined; 
        }
        return this.toDomain(user);
    }

    async create(userData: UserCreate): Promise<User> {
        const [user] = await this.db(this.userTable)
            .insert({
                email: userData.email,
                name: userData.name,
                password_hash: userData.passwordHash,
                role_id: userData.roleId
            })
            .returning('*');

        return this.toDomain(user);
    }

    async update(id: number, data: UpdateUser): Promise<User> {
        const [updated] = await this.db(this.userTable)
            .where({ id })
            .update(data)
            .returning('*');
        
        if (!updated) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado para atualização.`);
        }     

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<void> {
        const deleted = await this.db(this.userTable).where({ id }).del();

        if(deleted === 0) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
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