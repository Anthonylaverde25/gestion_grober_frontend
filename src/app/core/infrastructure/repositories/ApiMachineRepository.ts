import { axiosInstance } from "../../../di/container";
import { Machine } from "../../domain/entities/Machine";
import { MachineRepository } from "../../domain/repositories/MachineRepository";
import { MachineDTO } from "../dtos/MachineDTO";
import { MachineMapper } from "../mappers/MachineMapper";

export class ApiMachineRepository implements MachineRepository {
  async getByCompany(companyId: string): Promise<Machine[]> {
    const response = await axiosInstance.get("/api/v1/machines", {
      params: { company_id: companyId },
    });

    const data = Array.isArray(response.data.data) ? response.data.data : (response.data ?? []);
    return data.map((dto: any) => MachineMapper.toDomain(dto));
  }

  async save(machine: Machine): Promise<Machine> {
    const dto = MachineMapper.toDTO(machine);
    const response = await axiosInstance.post("/api/v1/machines", dto);

    return MachineMapper.toDomain(this.unwrapMachineResponse(response.data));
  }

  async changeCurrentArticle(
    machineId: string,
    articleId: string | null,
  ): Promise<Machine> {
    const response = await axiosInstance.patch(`/api/v1/machines/${machineId}/current-article`, {
      article_id: articleId,
    });

    return MachineMapper.toDomain(this.unwrapMachineResponse(response.data));
  }

  async update(id: string, machine: Partial<Machine>): Promise<Machine> {
    const dto = MachineMapper.toDTO(machine);
    const response = await axiosInstance.patch(`/api/v1/machines/${id}`, dto);

    return MachineMapper.toDomain(this.unwrapMachineResponse(response.data));
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
