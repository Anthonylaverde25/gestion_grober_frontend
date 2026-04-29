import api from "@/utils/api";
import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";
import { MachineDTO } from "../dtos/MachineDTO";
import { MachineMapper } from "../mappers/MachineMapper";

export class ApiMachineRepository implements MachineRepository {
  async getByCompany(companyId: string): Promise<Machine[]> {
    const response = await api
      .get("v1/machines", {
        searchParams: { company_id: companyId },
      })
      .json<{ data?: MachineDTO[] } | MachineDTO[]>();

    const data = Array.isArray(response) ? response : (response.data ?? []);
    return data.map((dto) => MachineMapper.toDomain(dto));
  }

  async save(machine: Machine): Promise<Machine> {
    const dto = MachineMapper.toDTO(machine);
    const response = await api
      .post("v1/machines", { json: dto })
      .json<{ data?: MachineDTO } | MachineDTO>();

    return MachineMapper.toDomain(this.unwrapMachineResponse(response));
  }

  async changeCurrentArticle(
    machineId: string,
    articleId: string | null,
  ): Promise<Machine> {
    const response = await api
      .patch(`v1/machines/${machineId}/current-article`, {
        json: { article_id: articleId },
      })
      .json<{ data?: MachineDTO } | MachineDTO>();

    return MachineMapper.toDomain(this.unwrapMachineResponse(response));
  }

  private unwrapMachineResponse(
    response: MachineDTO | { data?: MachineDTO },
  ): MachineDTO {
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as MachineDTO;
  }
}
