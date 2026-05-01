import { ApiClientRepository } from "../../infrastructure/repositories/ApiClientRepository";
import { Client, ClientProps } from "../../domain/entities/Client";

export class CreateClientUseCase {
  constructor(private clientRepository: ApiClientRepository) {}

  async execute(props: ClientProps): Promise<void> {
    const client = Client.create(props);
    await this.clientRepository.save(client);
  }
}
