import { ApiCampaignRepository } from "../../infrastructure/repositories/ApiCampaignRepository";

export class FinishCampaignUseCase {
  constructor(private campaignRepository: ApiCampaignRepository) {}

  async execute(campaignId: string): Promise<void> {
    await this.campaignRepository.finish(campaignId);
  }
}
