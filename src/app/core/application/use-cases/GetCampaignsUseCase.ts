import { ApiCampaignRepository } from "../../infrastructure/repositories/ApiCampaignRepository";
import { Campaign } from "../../domain/entities/Campaign";

export class GetCampaignsUseCase {
  constructor(private campaignRepository: ApiCampaignRepository) {}

  async execute(): Promise<Campaign[]> {
    return await this.campaignRepository.getAll();
  }
}
