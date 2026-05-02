import { axiosInstance } from "../../../di/container";
import { ServerTime } from "../../domain/entities/ServerTime";
import { SystemRepository } from "../../domain/repositories/SystemRepository";
import { SystemMapper } from "../mappers/SystemMapper";

export class ApiSystemRepository implements SystemRepository {
  async getServerTime(): Promise<ServerTime> {
    const response = await axiosInstance.get('/api/v1/system/server-time');
    return SystemMapper.toDomain(response.data.data);
  }
}
