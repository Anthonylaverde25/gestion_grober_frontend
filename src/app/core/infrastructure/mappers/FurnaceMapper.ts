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


    static toDTO(entity: Partial<Furnace>): any {
        const dto: any = {};
        
        if (entity.id) dto.id = entity.id;
        if (entity.companyId) dto.company_id = entity.companyId;
        if (entity.glassTypeId) dto.glass_type_id = entity.glassTypeId;
        if (entity.name) dto.name = entity.name;
        if (entity.maxCapacityTons) dto.max_capacity_tons = entity.maxCapacityTons;
        if (entity.status) dto.status = entity.status;
        
        if (entity.machines) {
            dto.machines = entity.machines.map(m => MachineMapper.toDTO(m));
        }

        return dto;
    }
}
