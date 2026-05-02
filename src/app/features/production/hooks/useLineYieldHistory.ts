import { useQuery } from "@tanstack/react-query";
import { ApiLineYieldRepository } from "../../../core/infrastructure/repositories/ApiLineYieldRepository";
import { GetLineYieldHistoryUseCase } from "../../../core/application/use-cases/GetLineYieldHistoryUseCase";
import { QUERY_KEYS } from "../../../core/infrastructure/QueryKeys";

const lineYieldRepository = new ApiLineYieldRepository();
const getLineYieldHistoryUseCase = new GetLineYieldHistoryUseCase(lineYieldRepository);

export function useLineYieldHistory(campaignId?: string) {
  const {
    data: history = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.production.yields.history(campaignId!),
    queryFn: () => getLineYieldHistoryUseCase.executeByCampaign(campaignId!),
    enabled: !!campaignId,
  });

  return {
    history,
    isLoading,
    error,
    refetch
  };
}
