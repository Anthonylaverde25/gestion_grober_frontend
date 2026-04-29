import { Extraction } from "../entities/Extraction";

export interface ExtractionRepository {
  save(extraction: Partial<Extraction>): Promise<Extraction>;
  getHistoryByMachine(machineId: string, limit?: number): Promise<Extraction[]>;
}
