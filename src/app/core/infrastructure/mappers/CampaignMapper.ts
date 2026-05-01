import { Campaign } from "../../domain/entities/Campaign";
import { CampaignDTO } from "../dtos/CampaignDTO";

export class CampaignMapper {
  static toDomain(dto: CampaignDTO): Campaign {
    return Campaign.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      codigo: dto.codigo,
      machineId: dto.machine_id,
      articleId: dto.article_id,
      clientId: dto.client_id,
      operatorId: dto.operator_id,
      status: dto.status,
      startedAt: dto.started_at,
      finishedAt: dto.finished_at,
      totalYieldRecords: dto.total_yield_records,
      observaciones: dto.observaciones,
      clientName: dto.client_name,
      articleName: dto.article_name,
      machine: dto.machine,
      client: dto.client,
      article: dto.article,
    });
  }

  static toDTO(entity: Campaign): CampaignDTO {
    return {
      id: entity.id,
      company_id: entity.companyId,
      codigo: entity.codigo,
      machine_id: entity.machineId,
      article_id: entity.articleId,
      client_id: entity.clientId,
      operator_id: entity.operatorId ?? undefined,
      status: entity.status,
      started_at: entity.startedAt.toISOString(),
      finished_at: entity.finishedAt?.toISOString(),
      total_yield_records: entity.totalYieldRecords,
      observaciones: entity.observaciones ?? undefined,
      client_name: entity.clientName ?? undefined,
      article_name: entity.articleName ?? undefined,
    };
  }

  static toCreateDTO(props: any): any {
    return {
      machine_id: props.machineId,
      article_id: props.articleId,
      client_id: props.clientId,
      codigo: props.codigo,
    };
  }
}
