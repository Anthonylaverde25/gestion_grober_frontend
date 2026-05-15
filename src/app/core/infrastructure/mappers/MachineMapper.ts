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

  static toDTO(entity: Partial<Machine>): any {
    const dto: any = {};
    
    if (entity.id) dto.id = entity.id;
    if (entity.companyId) dto.company_id = entity.companyId;
    if (entity.furnaceId) dto.furnace_id = entity.furnaceId;
    if (entity.currentArticleId) dto.current_article_id = entity.currentArticleId;
    if (entity.name) dto.name = entity.name;
    if (entity.status) dto.status = entity.status;

    return dto;
  }
}
