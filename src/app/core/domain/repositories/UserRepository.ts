import { User } from '../entities/User';

export interface UserRepository {
    getCompanyUsers(companyId?: string): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser(data: any): Promise<User>;
}

