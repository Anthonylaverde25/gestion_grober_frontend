import { UserAlias } from '../../../domain/entities/UserAlias';
import { UserAliasRepository } from '../../../domain/repositories/UserAliasRepository';

export class ToggleUserAliasStatusUseCase {
  constructor(private userAliasRepository: UserAliasRepository) {}

  async execute(id: string): Promise<UserAlias> {
    return this.userAliasRepository.toggleStatus(id);
  }
}
