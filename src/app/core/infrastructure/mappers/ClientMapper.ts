import { Client } from "../../domain/entities/Client";
import { ClientDTO } from "../dtos/ClientDTO";

export class ClientMapper {
  static toDomain(dto: ClientDTO): Client {
    return Client.reconstitute({
      id: dto.id,
      companyId: dto.company_id,
      commercialName: dto.commercial_name,
      businessName: dto.business_name,
      taxId: dto.tax_id,
      technicalContact: dto.technical_contact,
      email: dto.email,
    });
  }

  static toDTO(entity: Client): ClientDTO {
    return {
      id: entity.id,
      company_id: entity.companyId,
      commercial_name: entity.commercialName,
      business_name: entity.businessName,
      tax_id: entity.taxId,
      technical_contact: entity.technicalContact ?? undefined,
      email: entity.email ?? undefined,
    };
  }
}
