import { ApiCampaignRepository } from "../../infrastructure/repositories/ApiCampaignRepository";
import { Campaign } from "../../domain/entities/Campaign";

export class GetCampaignByIdUseCase {
  constructor(private campaignRepository: ApiCampaignRepository) {}

  async execute(campaignId: string): Promise<Campaign | null> {
    return await this.campaignRepository.findById(campaignId);
  }
}
