import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';

export class GetCompanyUsersUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(companyId?: string): Promise<User[]> {
        return this.userRepository.getCompanyUsers(companyId);
    }
}
