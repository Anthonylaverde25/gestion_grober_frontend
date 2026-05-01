import { useQuery } from "@tanstack/react-query";
import { ApiLineYieldRepository } from "../../../core/infrastructure/repositories/ApiLineYieldRepository";
import { GetLineYieldHistoryUseCase } from "../../../core/application/use-cases/GetLineYieldHistoryUseCase";

const lineYieldRepository = new ApiLineYieldRepository();
const getLineYieldHistoryUseCase = new GetLineYieldHistoryUseCase(lineYieldRepository);

export function useLineYieldHistory(campaignId?: string) {
  const { 
    data: history = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['line-yield-history', campaignId],
    queryFn: () => getLineYieldHistoryUseCase.executeByCampaign(campaignId!),
    enabled: !!campaignId,
  });

  return {
    history,
    isLoading,
    error,
    refetch,
  };
}
