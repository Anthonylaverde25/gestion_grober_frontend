import { User } from '../../domain/entities/User';
import { UserDTO } from '../dtos/UserDTO';
import { CompanyMapper } from './CompanyMapper';

export class UserMapper {
    static toDomain(dto: UserDTO): User {
        return new User({
            id: dto.id.toString() as any,
            name: dto.name,
            email: dto.email,
            roles: dto.roles,
            isActive: dto.is_active,
            lastActiveCompanyId: dto.last_active_company_id,
            companies: dto.companies?.map(c => CompanyMapper.toDomain(c)) ?? [],
            modules: dto.modules ?? []
        });
    }

    static toDTO(entity: User): UserDTO {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            roles: entity.roles,
            is_active: entity.isActive,
            last_active_company_id: entity.lastActiveCompanyId
        };
    }
}
