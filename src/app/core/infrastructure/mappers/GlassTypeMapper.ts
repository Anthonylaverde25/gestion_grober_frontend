import { GlassType } from '../../domain/entities/GlassType';
import { GlassTypeDTO } from '../dtos/GlassTypeDTO';

export class GlassTypeMapper {
    static toDomain(dto: GlassTypeDTO): GlassType {
        return new GlassType({
            id: dto.id,
            name: dto.name
        });
    }

    static toDTO(entity: GlassType): GlassTypeDTO {
        return {
            id: entity.id,
            name: entity.name,
        };
    }
}
