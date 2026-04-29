import { Furnace } from '../../domain/entities/Furnace';
import { FurnaceDTO } from '../dtos/FurnaceDTO';
import { MachineMapper } from './MachineMapper';

export class FurnaceMapper {
    static toDomain(dto: FurnaceDTO): Furnace {
      const machines = dto.machines ? dto.machines.map(m => MachineMapper.toDomain(m)) : [];
      
      return Furnace.reconstitute({
        id: dto.id,
        companyId: dto.company_id,
        glassTypeId: dto.glass_type_id,
        name: dto.name,
        maxCapacityTons: dto.max_capacity_tons,
        status: dto.status as any,
        machines: machines
      });
    }


    static toDTO(entity: Furnace): FurnaceDTO {
        return {
            id: entity.id,
            company_id: entity.companyId,
            glass_type_id: entity.glassTypeId,
            name: entity.name,
            max_capacity_tons: entity.maxCapacityTons,
            status: entity.status,
            machines: entity.machines.map(m => MachineMapper.toDTO(m))
        };
    }
}
