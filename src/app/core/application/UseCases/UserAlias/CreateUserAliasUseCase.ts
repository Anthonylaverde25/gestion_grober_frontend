import { UserAlias } from '../../../domain/entities/UserAlias';
import { UserAliasRepository } from '../../../domain/repositories/UserAliasRepository';

export class CreateUserAliasUseCase {
  constructor(private userAliasRepository: UserAliasRepository) {}

  async execute(params: { userId: number; name: string; legajo: string }): Promise<UserAlias> {
    return this.userAliasRepository.create(params);
  }
}
