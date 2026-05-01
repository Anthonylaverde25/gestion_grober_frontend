import { LineYield } from "../../domain/entities/LineYield";
import { LineYieldDTO } from "../dtos/LineYieldDTO";

export class LineYieldMapper {
  static toDomain(dto: LineYieldDTO): LineYield {
    return LineYield.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      campaignId: dto.campaign_id,
      formingYield: dto.forming_yield,
      packingYield: dto.packing_yield,
      recordedAt: dto.recorded_at,
      notes: dto.notes,
    });
  }

  static toDTO(entity: LineYield): LineYieldDTO {
    return {
      id: entity.id,
      company_id: entity.companyId,
      campaign_id: entity.campaignId,
      forming_yield: entity.formingYield,
      packing_yield: entity.packingYield,
      recorded_at: entity.recordedAt.toISOString(),
      notes: entity.notes ?? undefined,
    };
  }
}
