import { Furnace } from "../../domain/entities/Furnace";
import { FurnaceRepository } from "../../domain/repositories/FurnaceRepository";

export class GetFurnacesByCompanyUseCase {
    constructor(private repository: FurnaceRepository) {}

    async execute(companyId: string): Promise<Furnace[]> {
        return this.repository.getByCompany(companyId);
    }
}
