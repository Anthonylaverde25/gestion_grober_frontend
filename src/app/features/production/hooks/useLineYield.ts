import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiLineYieldRepository } from "../../../core/infrastructure/repositories/ApiLineYieldRepository";
import { RecordLineYieldUseCase } from "../../../core/application/use-cases/RecordLineYieldUseCase";
import { RecordLineYieldBatchUseCase, BatchYieldItem } from "../../../core/application/use-cases/RecordLineYieldBatchUseCase";
import { LineYieldProps } from "../../../core/domain/entities/LineYield";
import { QUERY_KEYS } from "../../../core/infrastructure/QueryKeys";

const lineYieldRepository = new ApiLineYieldRepository();
const recordLineYieldUseCase = new RecordLineYieldUseCase(lineYieldRepository);
const recordLineYieldBatchUseCase = new RecordLineYieldBatchUseCase(lineYieldRepository);

export function useLineYield() {
  const queryClient = useQueryClient();

  const recordMutation = useMutation({
    mutationFn: (props: LineYieldProps) => recordLineYieldUseCase.execute(props),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.yields.history(variables.campaignId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.campaigns.detail(variables.campaignId) });
      // Actualización en caliente para el dashboard
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.yields.all() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });

  const recordBatchMutation = useMutation({
    mutationFn: ({ campaignId, yields }: { campaignId: string, yields: BatchYieldItem[] }) => 
      recordLineYieldBatchUseCase.execute(campaignId, yields),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.yields.history(variables.campaignId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.campaigns.detail(variables.campaignId) });
      // Actualización en caliente para el dashboard
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.production.yields.all() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all });
    },
  });

  return {
    recordLineYield: recordMutation.mutateAsync,
    recordLineYieldBatch: recordBatchMutation.mutateAsync,
    isRecording: recordMutation.isPending || recordBatchMutation.isPending,
  };
}
