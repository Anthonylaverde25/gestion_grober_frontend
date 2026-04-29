import { Furnace } from "../entities/Furnace";

export interface FurnaceRepository {
    getByCompany(companyId: string): Promise<Furnace[]>;
    save(furnace: Furnace): Promise<Furnace>;
    delete(id: string): Promise<void>;
}
