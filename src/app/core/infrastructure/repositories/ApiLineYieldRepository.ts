import { axiosInstance } from "../../../di/container";
import { LineYield } from "../../domain/entities/LineYield";
import { LineYieldMapper } from "../mappers/LineYieldMapper";
import { LineYieldDTO } from "../dtos/LineYieldDTO";

export class ApiLineYieldRepository {
  async save(lineYield: LineYield): Promise<void> {
    try {
      const dto = LineYieldMapper.toDTO(lineYield);
      await axiosInstance.post('/api/v1/line-yields', dto);
    } catch (error) {
      console.error('Error in ApiLineYieldRepository.save:', error);
      throw new Error('Error al registrar rendimiento');
    }
  }

  async saveBatch(campaignId: string, yields: any[]): Promise<void> {
    try {
      const mappedYields = yields.map(item => ({
        forming_yield: item.formingYield,
        packing_yield: item.packingYield,
        recorded_at: item.recordedAt,
        notes: item.notes,
        user_alias_id: item.userAliasId
      }));

      await axiosInstance.post('/api/v1/line-yields/batch', {
        campaign_id: campaignId,
        items: mappedYields
      });
    } catch (error) {
      console.error('Error in ApiLineYieldRepository.saveBatch:', error);
      throw new Error('Error al registrar rendimientos en serie');
    }
  }

  async getHistoryByCampaign(campaignId: string): Promise<LineYield[]> {
    try {
      const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/line-yields/history`);
      return response.data.data.map((dto: LineYieldDTO) => LineYieldMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener historial de rendimiento');
    }
  }

  async getHistoryByMachine(machineId: string, limit?: number | null): Promise<LineYield[]> {
    try {
      const url = `/api/v1/machines/${machineId}/line-yields/history${limit ? `?limit=${limit}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data.data.map((dto: LineYieldDTO) => LineYieldMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener historial de rendimiento por máquina');
    }
  }
}
