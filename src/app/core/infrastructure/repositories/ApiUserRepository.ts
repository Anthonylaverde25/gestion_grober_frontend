import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { UserMapper } from '../mappers/UserMapper';
import { UserDTO } from '../dtos/UserDTO';
import { axiosInstance } from '@/app/di/container';

export class ApiUserRepository implements UserRepository {
    async getCompanyUsers(companyId?: string): Promise<User[]> {
        const response = await axiosInstance.get<{ data: UserDTO[] }>('/api/v1/users', {
            params: companyId ? { company_id: companyId } : {}
        });
        return response.data.data.map(dto => UserMapper.toDomain(dto));
    }

    async getUserById(id: number): Promise<User | null> {
        const response = await axiosInstance.get<{ data: UserDTO }>(`/api/v1/users/${id}`);
        return UserMapper.toDomain(response.data.data);
    }

    async createUser(data: any): Promise<User> {
        const response = await axiosInstance.post<{ data: UserDTO }>('/api/v1/users', data);
        return UserMapper.toDomain(response.data.data);
    }
}
