import { ApiLineYieldRepository } from "../../infrastructure/repositories/ApiLineYieldRepository";
import { LineYield, LineYieldProps } from "../../domain/entities/LineYield";

export class RecordLineYieldUseCase {
  constructor(private lineYieldRepository: ApiLineYieldRepository) {}

  async execute(props: LineYieldProps): Promise<void> {
    const lineYield = LineYield.create(props);
    await this.lineYieldRepository.save(lineYield);
  }
}
