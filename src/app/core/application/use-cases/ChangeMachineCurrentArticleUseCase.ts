import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";

export class ChangeMachineCurrentArticleUseCase {
  constructor(private repository: MachineRepository) {}

  async execute(machineId: string, articleId: string | null): Promise<Machine> {
    return this.repository.changeCurrentArticle(machineId, articleId);
  }
}
