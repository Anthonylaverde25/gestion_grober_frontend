import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiLineYieldRepository } from "../../../core/infrastructure/repositories/ApiLineYieldRepository";
import { RecordLineYieldUseCase } from "../../../core/application/use-cases/RecordLineYieldUseCase";
import { LineYieldProps } from "../../../core/domain/entities/LineYield";

const lineYieldRepository = new ApiLineYieldRepository();
const recordLineYieldUseCase = new RecordLineYieldUseCase(lineYieldRepository);

export function useLineYield() {
  const queryClient = useQueryClient();

  const recordMutation = useMutation({
    mutationFn: (props: LineYieldProps) => recordLineYieldUseCase.execute(props),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['line-yield-history', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
    },
  });

  return {
    recordLineYield: recordMutation.mutateAsync,
    isRecording: recordMutation.isPending,
  };
}
