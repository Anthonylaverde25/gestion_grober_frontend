import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";

export class UpdateMachineUseCase {
    constructor(private machineRepository: MachineRepository) {}

    async execute(id: string, data: Partial<Machine>): Promise<Machine> {
        return await this.machineRepository.update(id, data);
    }
}
