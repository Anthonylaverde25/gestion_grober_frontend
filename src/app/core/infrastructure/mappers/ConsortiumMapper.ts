import { Consortium } from '../../domain/entities/Consortium';
import { ConsortiumDTO } from '../dtos/ConsortiumDTO';

export class ConsortiumMapper {
    static toDomain(dto: ConsortiumDTO): Consortium {
        return new Consortium({
            id: dto.id,
            name: dto.name,
            isActive: dto.is_active
        });
    }

    static toDTO(entity: Consortium): ConsortiumDTO {
        return {
            id: entity.id,
            name: entity.name,
            is_active: entity.isActive,
        };
    }
}
