import { Extraction } from "../../domain/entities/Extraction";
import { ExtractionRepository } from "../../domain/repositories/ExtractionRepository";

export class RegisterExtractionUseCase {
  constructor(private extractionRepository: ExtractionRepository) {}

  async execute(extractionData: Partial<Extraction>): Promise<Extraction> {
    // Aquí se podrían añadir validaciones de aplicación adicionales si fuera necesario
    return this.extractionRepository.save(extractionData);
  }
}
