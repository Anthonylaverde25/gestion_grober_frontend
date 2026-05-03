import { ApiLineYieldRepository } from "../../infrastructure/repositories/ApiLineYieldRepository";

export interface BatchYieldItem {
  forming_yield: number;
  packing_yield: number;
  recorded_at: string;
  notes?: string;
  user_alias_id?: string | null;
}

export class RecordLineYieldBatchUseCase {
  constructor(private lineYieldRepository: ApiLineYieldRepository) {}

  async execute(campaignId: string, yields: BatchYieldItem[]): Promise<void> {
    return this.lineYieldRepository.saveBatch(campaignId, yields);
  }
}
