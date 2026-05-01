import { ApiLineYieldRepository } from "../../infrastructure/repositories/ApiLineYieldRepository";
import { LineYield } from "../../domain/entities/LineYield";

export class GetLineYieldHistoryUseCase {
  constructor(private lineYieldRepository: ApiLineYieldRepository) {}

  async executeByCampaign(campaignId: string): Promise<LineYield[]> {
    return await this.lineYieldRepository.getHistoryByCampaign(campaignId);
  }

  async executeByMachine(machineId: string, limit: number = 50): Promise<LineYield[]> {
    return await this.lineYieldRepository.getHistoryByMachine(machineId, limit);
  }
}
