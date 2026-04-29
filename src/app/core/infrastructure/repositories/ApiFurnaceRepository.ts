import { Furnace } from "../../domain/entities/Furnace";
import { FurnaceRepository } from "../../domain/repositories/FurnaceRepository";
import { FurnaceMapper } from "../mappers/FurnaceMapper";
import api from "@/utils/api";

export class ApiFurnaceRepository implements FurnaceRepository {
    async getByCompany(companyId: string): Promise<Furnace[]> {
        const response: any = await api.get('v1/furnaces', {
            searchParams: { company_id: companyId }
        }).json();
        
        const data = response.data || response;
        return data.map((dto: any) => FurnaceMapper.toDomain(dto));
    }

    async save(furnace: Furnace): Promise<Furnace> {
        const dto = FurnaceMapper.toDTO(furnace);
        const response: any = await api.post('v1/furnaces', { json: dto }).json();
        return FurnaceMapper.toDomain(response.data || response);
    }

    async delete(id: string): Promise<void> {
        await api.delete(`v1/furnaces/${id}`);
    }
}
