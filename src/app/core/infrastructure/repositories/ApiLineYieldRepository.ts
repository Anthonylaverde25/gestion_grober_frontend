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

  async getHistoryByCampaign(campaignId: string): Promise<LineYield[]> {
    try {
      const response = await axiosInstance.get(`/api/v1/campaigns/${campaignId}/line-yields/history`);
      return response.data.data.map((dto: LineYieldDTO) => LineYieldMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener historial de rendimiento');
    }
  }

  async getHistoryByMachine(machineId: string, limit: number = 50): Promise<LineYield[]> {
    try {
      const response = await axiosInstance.get(`/api/v1/machines/${machineId}/line-yields/history?limit=${limit}`);
      return response.data.data.map((dto: LineYieldDTO) => LineYieldMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener historial de rendimiento por máquina');
    }
  }
}
