import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiCampaignRepository } from "@/app/core/infrastructure/repositories/ApiCampaignRepository";
import { GetCampaignsUseCase } from "@/app/core/application/use-cases/GetCampaignsUseCase";
import { OpenCampaignUseCase } from "@/app/core/application/use-cases/OpenCampaignUseCase";
import { FinishCampaignUseCase } from "@/app/core/application/use-cases/FinishCampaignUseCase";
import { useSnackbar } from "notistack";

const campaignRepository = new ApiCampaignRepository();
const getCampaignsUseCase = new GetCampaignsUseCase(campaignRepository);
const openCampaignUseCase = new OpenCampaignUseCase(campaignRepository);
const finishCampaignUseCase = new FinishCampaignUseCase(campaignRepository);

export function useCampaigns() {
  const { activeCompany, isLoadingContext } = useBusiness();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: campaigns = [], isLoading, error, refetch } = useQuery({
    queryKey: ['campaigns', activeCompany?.id],
    queryFn: () => getCampaignsUseCase.execute(),
    enabled: !!activeCompany?.id && !isLoadingContext,
  });

  const startCampaignMutation = useMutation({
    mutationFn: (data: { machineId: string, articleId: string, clientId: string, codigo?: string }) => {
      return openCampaignUseCase.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeCompany?.id] });
      enqueueSnackbar("Campaña iniciada correctamente", { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || "Error al iniciar la campaña", { variant: 'error' });
    }
  });

  const finishCampaignMutation = useMutation({
    mutationFn: (campaignId: string) => {
      return finishCampaignUseCase.execute(campaignId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeCompany?.id] });
      enqueueSnackbar("Campaña finalizada correctamente", { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.message || "Error al finalizar la campaña", { variant: 'error' });
    }
  });

  return {
    campaigns,
    isLoading: isLoading || isLoadingContext,
    error,
    refetch,
    startCampaign: startCampaignMutation.mutateAsync,
    isStarting: startCampaignMutation.isPending,
    finishCampaign: finishCampaignMutation.mutateAsync,
    isFinishing: finishCampaignMutation.isPending
  };
}
