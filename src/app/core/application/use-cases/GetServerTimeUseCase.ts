import { ServerTime } from "../../domain/entities/ServerTime";
import { SystemRepository } from "../../domain/repositories/SystemRepository";

export class GetServerTimeUseCase {
  constructor(private systemRepository: SystemRepository) {}

  async execute(): Promise<ServerTime> {
    return this.systemRepository.getServerTime();
  }
}
