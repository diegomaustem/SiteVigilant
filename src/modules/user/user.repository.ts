import type { Knex } from 'knex';
import type { User, InputUser} from './user.types.js'
import bcrypt from 'bcrypt';

export class UserRepository {
    private db: Knex;
    private readonly userTable = 'users';

    constructor(db: Knex) {
        this.db = db;
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const user = await this.db(this.userTable).where({ email }).first();
        if (!user) return undefined;
        return {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.password_hash,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        };
    }

    async create(userData: InputUser): Promise<User> {
        const passwordHash = await bcrypt.hash(userData.password, 10);
        const [user] = await this.db(this.userTable)
        .insert({
            email: userData.email,
            name: userData.name,
            password_hash: passwordHash,
        })
        .returning('*');

        return user;
    }
}
