import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(data: any): Promise<User> {
        return this.userRepository.createUser(data);
    }
}
