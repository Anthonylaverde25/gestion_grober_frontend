import { Article } from "../../domain/entities/Article";
import { ArticleDTO } from "../dtos/ArticleDTO";

export class ArticleMapper {
  /**
   * Transforma un DTO de la API a una entidad de dominio rica.
   */
  static toDomain(dto: ArticleDTO): Article {
    return Article.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      name: dto.name
    });
  }

  /**
   * Transforma una entidad de dominio a un objeto plano para envío a la API.
   */
  static toDTO(domain: Article): ArticleDTO {
    return {
      id: domain.id,
      company_id: domain.companyId,
      name: domain.name,
    };
  }
}
