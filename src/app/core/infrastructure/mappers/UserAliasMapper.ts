import { UserAlias } from '../../domain/entities/UserAlias';

export class UserAliasMapper {
  static toDomain(dto: any): UserAlias {
    return new UserAlias({
      id: dto.id,
      userId: dto.user_id,
      name: dto.name,
      legajo: dto.legajo,
      isActive: dto.is_active,
    });
  }

  static toInfrastructure(alias: Partial<UserAlias>): any {
    return {
      user_id: alias.userId,
      name: alias.name,
      legajo: alias.legajo,
      is_active: alias.isActive,
    };
  }
}
