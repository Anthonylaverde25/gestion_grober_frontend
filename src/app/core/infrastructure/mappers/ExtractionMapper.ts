import { Extraction } from "../../domain/entities/Extraction";
import { ExtractionDTO } from "../dtos/ExtractionDTO";
import { ArticleMapper } from "./ArticleMapper";

export class ExtractionMapper {
  static toDomain(dto: ExtractionDTO): Extraction {
    return Extraction.reconstitute({
      id: dto.id,
      machineId: dto.machine_id,
      articleId: dto.article_id,
      articleName: dto.article_name,
      article: dto.article ? ArticleMapper.toDomain(dto.article as any) : undefined,
      percentage: Number(dto.percentage),
      measuredAt: new Date(dto.measured_at),
      isActive: dto.is_active,
    });
  }

  static toDTO(entity: Partial<Extraction>): Partial<ExtractionDTO> {
    const dto: any = {};
    if (entity.id) dto.id = entity.id;
    if (entity.machineId) dto.machine_id = entity.machineId;
    if (entity.articleId) dto.article_id = entity.articleId;
    if (entity.percentage !== undefined) dto.percentage = entity.percentage;
    if (entity.measuredAt) {
      dto.measured_at = entity.measuredAt instanceof Date 
        ? entity.measuredAt.toISOString() 
        : entity.measuredAt;
    }
    return dto;
  }
}
