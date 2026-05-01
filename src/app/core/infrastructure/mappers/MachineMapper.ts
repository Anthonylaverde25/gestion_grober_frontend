import { Machine } from "../../domain/entities/Machine";
import { MachineDTO } from "../dtos/MachineDTO";

export class MachineMapper {
  static toDomain(dto: MachineDTO): Machine {
    return Machine.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      furnaceId: dto.furnace_id,
      currentArticleId: dto.current_article?.id ?? null,
      currentArticleName: dto.current_article?.name,
      currentCampaignId: dto.current_campaign?.id,
      currentClientName: dto.current_campaign?.client_name,
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
      // Note: mapping current_campaign back to DTO is usually not needed for requests,
      // but if needed we can omit it or pass null
    };
  }
}
