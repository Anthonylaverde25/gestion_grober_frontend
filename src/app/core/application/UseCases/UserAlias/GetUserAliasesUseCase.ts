import { UserAlias } from '../../../domain/entities/UserAlias';
import { UserAliasRepository } from '../../../domain/repositories/UserAliasRepository';

export class GetUserAliasesUseCase {
  constructor(private userAliasRepository: UserAliasRepository) {}

  async execute(userId: number): Promise<UserAlias[]> {
    return this.userAliasRepository.findByUser(userId);
  }
}
