import { Machine } from "../../domain/entities/Machine";
import { MachineDTO } from "../dtos/MachineDTO";

export class MachineMapper {
  static toDomain(dto: MachineDTO): Machine {
    return Machine.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      furnaceId: dto.furnace_id,
      currentArticleId: dto.current_article.id,
      currentArticleName: dto.current_article.name,
      name: dto.name,
      status: dto.status,
    });
  }

  static toDTO(entity: Machine): MachineDTO {
    return {
      id: entity.id,
      company_id: entity.companyId,
      furnace_id: entity.furnaceId,
      current_article_id: entity.currentArticleId,
      name: entity.name,
      status: entity.status,
    };
  }
}
