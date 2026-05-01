import { ApiCampaignRepository } from "../../infrastructure/repositories/ApiCampaignRepository";
import { Campaign, CampaignProps } from "../../domain/entities/Campaign";

export class OpenCampaignUseCase {
  constructor(private campaignRepository: ApiCampaignRepository) {}

  async execute(props: CampaignProps): Promise<Campaign> {
    // La validación de dominio ocurre dentro de la entidad al crearla (si fuera necesario)
    // En el frontend, el "create" suele ser más flexible para capturar datos de formulario
    return await this.campaignRepository.start(props);
  }
}
