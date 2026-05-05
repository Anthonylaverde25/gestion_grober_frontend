import { useMutation } from '@tanstack/react-query';
import { ApiUserAliasRepository } from '@/app/core/infrastructure/repositories/ApiUserAliasRepository';
import { CreateUserAliasUseCase } from '@/app/core/application/useCases/UserAlias/CreateUserAliasUseCase';

const userAliasRepository = new ApiUserAliasRepository();
const createUserAliasUseCase = new CreateUserAliasUseCase(userAliasRepository);

export function useUserAliases() {
  const createAliasMutation = useMutation({
    mutationFn: (params: { userId: number; name: string; legajo: string }) => 
      createUserAliasUseCase.execute(params),
  });

  return {
    createAlias: createAliasMutation.mutateAsync,
    isCreating: createAliasMutation.isPending,
  };
}
