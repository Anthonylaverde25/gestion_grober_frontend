import { Extraction } from "../../domain/entities/Extraction";
import { ExtractionRepository } from "../../domain/repositories/ExtractionRepository";

export class GetExtractionHistoryUseCase {
  constructor(private extractionRepository: ExtractionRepository) {}

  async execute(machineId: string, limit: number = 50): Promise<Extraction[]> {
    if (!machineId) {
      throw new Error("El ID de la máquina es requerido para obtener el historial.");
    }

    return this.extractionRepository.getHistoryByMachine(machineId, limit);
  }
}
