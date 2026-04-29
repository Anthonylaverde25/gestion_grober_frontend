import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiExtractionRepository } from "@/app/core/infrastructure/repositories/ApiExtractionRepository";
import { GetExtractionHistoryUseCase } from "@/app/core/application/use-cases/GetExtractionHistoryUseCase";
import { RegisterExtractionUseCase } from "@/app/core/application/use-cases/RegisterExtractionUseCase";
import { Extraction } from "@/app/core/domain/entities/Extraction";

const extractionRepository = new ApiExtractionRepository();
const getExtractionHistoryUseCase = new GetExtractionHistoryUseCase(extractionRepository);
const registerExtractionUseCase = new RegisterExtractionUseCase(extractionRepository);

export function useExtractionHistory(machineId?: string) {
  const queryClient = useQueryClient();

  const { 
    data: history = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['extraction-history', machineId],
    queryFn: () => getExtractionHistoryUseCase.execute(machineId!),
    enabled: !!machineId,
  });

  const registerMutation = useMutation({
    mutationFn: (data: Partial<Extraction>) => registerExtractionUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extraction-history', machineId] });
      queryClient.invalidateQueries({ queryKey: ['extraction-dashboard'] });
    },
  });

  return {
    history,
    isLoading,
    error,
    refetch,
    registerExtraction: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending
  };
}
