import { ApiLineYieldRepository } from "../../infrastructure/repositories/ApiLineYieldRepository";

export interface BatchYieldItem {
  formingYield: number;
  packingYield: number;
  recordedAt: string;
  notes?: string;
  userAliasId?: string | null;
}

export class RecordLineYieldBatchUseCase {
  constructor(private lineYieldRepository: ApiLineYieldRepository) {}

  async execute(campaignId: string, yields: BatchYieldItem[]): Promise<void> {
    return this.lineYieldRepository.saveBatch(campaignId, yields);
  }
}
