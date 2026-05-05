import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiUserRepository } from '@/app/core/infrastructure/repositories/ApiUserRepository';
import { GetCompanyUsersUseCase } from '@/app/core/application/UseCases/User/GetCompanyUsersUseCase';
import { CreateUserUseCase } from '@/app/core/application/UseCases/User/CreateUserUseCase';
import { User } from '@/app/core/domain/entities/User';
import { SettingsTeamMember } from '../../types';

export const teamMembersQueryKey = ['settings', 'team-members'] as const;

const userRepository = new ApiUserRepository();
const getCompanyUsersUseCase = new GetCompanyUsersUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

export function useTeamMembers() {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: teamMembersQueryKey,
		queryFn: () => getCompanyUsersUseCase.execute(),
		select: (users: User[]): SettingsTeamMember[] => 
			users.map(user => ({
				id: user.id.toString(),
				name: user.name,
				email: user.email,
				role: user.roles[0] || 'read',
				avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
			}))
	});

	const createUserMutation = useMutation({
		mutationFn: (data: any) => createUserUseCase.execute(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
		}
	});

	return {
		...query,
		createUser: createUserMutation.mutateAsync,
		isCreating: createUserMutation.isPending
	};
}
