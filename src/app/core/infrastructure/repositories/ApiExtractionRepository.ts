import { axiosInstance } from "../../../di/container";
import { Extraction } from "../../domain/entities/Extraction";
import { ExtractionRepository } from "../../domain/repositories/ExtractionRepository";
import { ExtractionDTO } from "../dtos/ExtractionDTO";
import { ExtractionMapper } from "../mappers/ExtractionMapper";

export class ApiExtractionRepository implements ExtractionRepository {
  async save(extraction: Partial<Extraction>): Promise<Extraction> {
    const dto = ExtractionMapper.toDTO(extraction);
    const response = await axiosInstance.post("/api/v1/extractions", dto);
    
    return ExtractionMapper.toDomain(this.unwrapExtractionResponse(response.data));
  }

  async getHistoryByMachine(machineId: string, limit: number = 50): Promise<Extraction[]> {
    const response = await axiosInstance.get(`/api/v1/machines/${machineId}/extractions/history`, {
      params: { limit, include: 'article' },
    });

    const data = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
    return data.map((dto: any) => ExtractionMapper.toDomain(dto));
  }

  private unwrapExtractionResponse(
    response: ExtractionDTO | { data?: ExtractionDTO },
  ): ExtractionDTO {
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as ExtractionDTO;
  }
}
