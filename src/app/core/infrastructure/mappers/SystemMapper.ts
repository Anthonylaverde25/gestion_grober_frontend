import { ServerTime } from "../../domain/entities/ServerTime";

export class SystemMapper {
  static toDomain(dto: any): ServerTime {
    return {
      iso: dto.iso,
      formatted: dto.formatted,
      timezone: dto.timezone,
      timestamp: dto.timestamp,
    };
  }
}
