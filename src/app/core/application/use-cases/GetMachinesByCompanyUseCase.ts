import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";

export class GetMachinesByCompanyUseCase {
  constructor(private repository: MachineRepository) {}

  async execute(companyId: string): Promise<Machine[]> {
    return this.repository.getByCompany(companyId);
  }
}
