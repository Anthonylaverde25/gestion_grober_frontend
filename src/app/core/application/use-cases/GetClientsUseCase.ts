import { ApiClientRepository } from "../../infrastructure/repositories/ApiClientRepository";
import { Client } from "../../domain/entities/Client";

export class GetClientsUseCase {
  constructor(private clientRepository: ApiClientRepository) {}

  async execute(): Promise<Client[]> {
    return await this.clientRepository.getAll();
  }
}
