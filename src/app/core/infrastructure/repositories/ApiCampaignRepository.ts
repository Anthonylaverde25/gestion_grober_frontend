import { axiosInstance } from "../../../di/container";
import { Campaign } from "../../domain/entities/Campaign";
import { CampaignMapper } from "../mappers/CampaignMapper";
import { CampaignDTO } from "../dtos/CampaignDTO";

export class ApiCampaignRepository {
  async findById(id: string): Promise<Campaign | null> {
    try {
      const response = await axiosInstance.get(`/api/v1/campaigns/${id}`);
      return CampaignMapper.toDomain(response.data.data);
    } catch (error) {
      return null;
    }
  }

  async getAll(): Promise<Campaign[]> {
    try {
      const response = await axiosInstance.get('/api/v1/campaigns');
      return response.data.data.map((dto: CampaignDTO) => CampaignMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener campañas');
    }
  }

  async start(campaign: Partial<CampaignProps>): Promise<Campaign> {
    try {
      const dto = CampaignMapper.toCreateDTO(campaign);
      const response = await axiosInstance.post('/api/v1/campaigns/start', dto);
      return CampaignMapper.toDomain(response.data.data);
    } catch (error) {
      throw new Error('Error al iniciar campaña');
    }
  }

  async finish(id: string): Promise<void> {
    try {
      await axiosInstance.post(`/api/v1/campaigns/${id}/finish`);
    } catch (error) {
      throw new Error('Error al finalizar campaña');
    }
  }
}

import { CampaignProps } from "../../domain/entities/Campaign";
