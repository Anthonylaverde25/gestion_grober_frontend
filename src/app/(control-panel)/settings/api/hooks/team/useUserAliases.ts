import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiUserAliasRepository } from '@/app/core/infrastructure/repositories/ApiUserAliasRepository';
import { CreateUserAliasUseCase } from '@/app/core/application/useCases/UserAlias/CreateUserAliasUseCase';
import { GetUserAliasesUseCase } from '@/app/core/application/useCases/UserAlias/GetUserAliasesUseCase';

const userAliasRepository = new ApiUserAliasRepository();
const createUserAliasUseCase = new CreateUserAliasUseCase(userAliasRepository);
const getUserAliasesUseCase = new GetUserAliasesUseCase(userAliasRepository);

export function useUserAliases(userId?: number) {
  const createAliasMutation = useMutation({
    mutationFn: (params: { userId: number; name: string; legajo: string }) => 
      createUserAliasUseCase.execute(params),
  });

  const query = useQuery({
    queryKey: ['user-aliases', userId],
    queryFn: () => getUserAliasesUseCase.execute(userId!),
    enabled: !!userId,
  });

  return {
    aliases: query.data || [],
    isLoading: query.isLoading,
    createAlias: createAliasMutation.mutateAsync,
    isCreating: createAliasMutation.isPending,
  };
}
