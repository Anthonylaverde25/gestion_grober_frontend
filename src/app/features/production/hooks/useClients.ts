import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClientRepository } from "../../../core/infrastructure/repositories/ApiClientRepository";
import { GetClientsUseCase } from "../../../core/application/use-cases/GetClientsUseCase";
import { CreateClientUseCase } from "../../../core/application/use-cases/CreateClientUseCase";
import { ClientProps } from "../../../core/domain/entities/Client";

const clientRepository = new ApiClientRepository();
const getClientsUseCase = new GetClientsUseCase(clientRepository);
const createClientUseCase = new CreateClientUseCase(clientRepository);

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClientsUseCase.execute(),
  });

  const createMutation = useMutation({
    mutationFn: (props: ClientProps) => createClientUseCase.execute(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    error,
    refetch,
    createClient: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
