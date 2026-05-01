import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCampaignRepository } from "../../../core/infrastructure/repositories/ApiCampaignRepository";
import { GetCampaignByIdUseCase } from "../../../core/application/use-cases/GetCampaignByIdUseCase";
import { FinishCampaignUseCase } from "../../../core/application/use-cases/FinishCampaignUseCase";

const campaignRepository = new ApiCampaignRepository();
const getCampaignByIdUseCase = new GetCampaignByIdUseCase(campaignRepository);
const finishCampaignUseCase = new FinishCampaignUseCase(campaignRepository);

export function useCampaign(campaignId?: string) {
  const queryClient = useQueryClient();

  const { 
    data: campaign, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaignByIdUseCase.execute(campaignId!),
    enabled: !!campaignId,
  });

  const finishMutation = useMutation({
    mutationFn: (id: string) => finishCampaignUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });

  return {
    campaign,
    isLoading,
    error,
    refetch,
    finishCampaign: finishMutation.mutateAsync,
    isFinishing: finishMutation.isPending,
  };
}
