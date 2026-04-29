import { Furnace } from "../../domain/entities/Furnace";
import { FurnaceRepository } from "../../domain/repositories/FurnaceRepository";

export class CreateFurnaceUseCase {
    constructor(private repository: FurnaceRepository) {}

    async execute(data: {
        companyId: string;
        glassTypeId: number;
        name: string;
        maxCapacityTons: number;
    }): Promise<Furnace> {
        const furnace = Furnace.create({
            id: '', 
            companyId: data.companyId,
            glassTypeId: data.glassTypeId,
            name: data.name,
            maxCapacityTons: data.maxCapacityTons,
            status: 'operational'
        });

        return this.repository.save(furnace);
    }
}
