import { Furnace } from "../../domain/entities/Furnace";
import { FurnaceRepository } from "../../domain/repositories/FurnaceRepository";

export class UpdateFurnaceUseCase {
    constructor(private furnaceRepository: FurnaceRepository) {}

    async execute(id: string, furnace: Partial<Furnace>): Promise<Furnace> {
        return this.furnaceRepository.update(id, furnace);
    }
}
