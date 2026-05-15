import { axiosInstance } from "../../../di/container";
import { Furnace } from "../../domain/entities/Furnace";
import { FurnaceRepository } from "../../domain/repositories/FurnaceRepository";
import { FurnaceMapper } from "../mappers/FurnaceMapper";

export class ApiFurnaceRepository implements FurnaceRepository {
    async getByCompany(companyId: string): Promise<Furnace[]> {
        const response = await axiosInstance.get('/api/v1/furnaces', {
            params: { company_id: companyId }
        });
        
        const data = response.data.data || response.data;
        return data.map((dto: any) => FurnaceMapper.toDomain(dto));
    }

    async save(furnace: Furnace): Promise<Furnace> {
        const dto = FurnaceMapper.toDTO(furnace);
        const response = await axiosInstance.post('/api/v1/furnaces', dto);
        return FurnaceMapper.toDomain(response.data.data || response.data);
    }

    async update(id: string, furnace: Partial<Furnace>): Promise<Furnace> {
        const dto = FurnaceMapper.toDTO(furnace as Furnace);
        const response = await axiosInstance.patch(`/api/v1/furnaces/${id}`, dto);
        return FurnaceMapper.toDomain(response.data.data || response.data);
    }

    async delete(id: string): Promise<void> {
        await axiosInstance.delete(`/api/v1/furnaces/${id}`);
    }
}
