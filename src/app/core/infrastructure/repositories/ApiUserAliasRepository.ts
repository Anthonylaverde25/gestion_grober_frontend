import { UserAliasRepository } from '../../domain/repositories/UserAliasRepository';
import { UserAlias } from '../../domain/entities/UserAlias';
import { UserAliasMapper } from '../mappers/UserAliasMapper';
import { axiosInstance } from '@/app/di/container';

export class ApiUserAliasRepository implements UserAliasRepository {
  async create(alias: { userId: number; name: string; legajo: string }): Promise<UserAlias> {
    const infrastructureData = UserAliasMapper.toInfrastructure(alias as any);
    const response = await axiosInstance.post<{ data: any }>('/api/v1/user-aliases', infrastructureData);
    return UserAliasMapper.toDomain(response.data.data);
  }

  async searchByLegajo(legajo: string): Promise<UserAlias | null> {
    try {
      const response = await axiosInstance.get<{ data: any }>('/api/v1/user-aliases/search', {
        params: { legajo },
      });
      return UserAliasMapper.toDomain(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByUser(userId: number): Promise<UserAlias[]> {
    const response = await axiosInstance.get<{ data: any[] }>('/api/v1/user-aliases', {
      params: { user_id: userId },
    });
    return response.data.data.map((dto) => UserAliasMapper.toDomain(dto));
  }
}
