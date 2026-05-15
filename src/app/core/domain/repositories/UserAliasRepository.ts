import { UserAlias } from '../entities/UserAlias';

export interface UserAliasRepository {
  create(alias: { userId: number; name: string; legajo: string }): Promise<UserAlias>;
  searchByLegajo(legajo: string): Promise<UserAlias | null>;
  findByUser(userId: number): Promise<UserAlias[]>;
  toggleStatus(id: string): Promise<UserAlias>;
}
