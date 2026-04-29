import { Company } from '../../domain/entities/Company';
import { CompanyDTO } from '../dtos/CompanyDTO';

export class CompanyMapper {
    static toDomain(dto: CompanyDTO): Company {
        return new Company({
            id: dto.id,
            consortiumId: dto.consortium_id,
            name: dto.name,
            managerId: dto.manager_id,
            isActive: dto.is_active
        });
    }

    static toDTO(entity: Company): CompanyDTO {
        return {
            id: entity.id,
            consortium_id: entity.consortiumId,
            name: entity.name,
            manager_id: entity.managerId,
            is_active: entity.isActive,
        };
    }
}
