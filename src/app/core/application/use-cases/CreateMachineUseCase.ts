import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";

export class CreateMachineUseCase {
  constructor(private repository: MachineRepository) {}

  async execute(data: {
    companyId: string;
    furnaceId: string;
    name: string;
    status: "operational" | "maintenance" | "shutdown";
  }): Promise<Machine> {
    const machine = Machine.create({
      id: "",
      companyId: data.companyId,
      furnaceId: data.furnaceId,
      name: data.name,
      status: data.status,
    });

    return this.repository.save(machine);
  }
}
