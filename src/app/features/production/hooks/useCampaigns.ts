import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCampaignRepository } from "../../../core/infrastructure/repositories/ApiCampaignRepository";
import { GetCampaignsUseCase } from "../../../core/application/use-cases/GetCampaignsUseCase";
import { OpenCampaignUseCase } from "../../../core/application/use-cases/OpenCampaignUseCase";
import { CampaignProps } from "../../../core/domain/entities/Campaign";

const campaignRepository = new ApiCampaignRepository();
const getCampaignsUseCase = new GetCampaignsUseCase(campaignRepository);
const openCampaignUseCase = new OpenCampaignUseCase(campaignRepository);

export function useCampaigns() {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getCampaignsUseCase.execute(),
  });

  const openMutation = useMutation({
    mutationFn: (props: CampaignProps) => openCampaignUseCase.execute(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['machines'] });
    },
  });

  return {
    campaigns,
    isLoading,
    error,
    refetch,
    openCampaign: openMutation.mutateAsync,
    isOpening: openMutation.isPending,
  };
}
