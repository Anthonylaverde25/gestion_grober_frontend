import { axiosInstance } from "../../../di/container";
import { Client } from "../../domain/entities/Client";
import { ClientMapper } from "../mappers/ClientMapper";
import { ClientDTO } from "../dtos/ClientDTO";

export class ApiClientRepository {
  async getAll(): Promise<Client[]> {
    try {
      const response = await axiosInstance.get('/api/v1/clients');
      return response.data.data.map((dto: ClientDTO) => ClientMapper.toDomain(dto));
    } catch (error) {
      throw new Error('Error al obtener clientes');
    }
  }

  async save(client: Client): Promise<void> {
    try {
      const dto = ClientMapper.toDTO(client);
      await axiosInstance.post('/api/v1/clients', dto);
    } catch (error) {
      throw new Error('Error al guardar el cliente');
    }
  }
}
