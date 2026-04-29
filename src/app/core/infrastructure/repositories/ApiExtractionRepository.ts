import api from "@/utils/api";
import { Extraction } from "../../domain/entities/Extraction";
import { ExtractionRepository } from "../../domain/repositories/ExtractionRepository";
import { ExtractionDTO } from "../dtos/ExtractionDTO";
import { ExtractionMapper } from "../mappers/ExtractionMapper";

export class ApiExtractionRepository implements ExtractionRepository {
  async save(extraction: Partial<Extraction>): Promise<Extraction> {
    const dto = ExtractionMapper.toDTO(extraction);
    const response = await api
      .post("v1/extractions", { json: dto })
      .json<{ data?: ExtractionDTO } | ExtractionDTO>();

    return ExtractionMapper.toDomain(this.unwrapExtractionResponse(response));
  }

  async getHistoryByMachine(machineId: string, limit: number = 50): Promise<Extraction[]> {
    const response = await api
      .get(`v1/machines/${machineId}/extractions/history`, {
        searchParams: { limit, include: 'article' },
      })
      .json<{ data?: ExtractionDTO[] } | ExtractionDTO[]>();

    const data = Array.isArray(response) ? response : (response.data ?? []);
    return data.map((dto) => ExtractionMapper.toDomain(dto));
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
