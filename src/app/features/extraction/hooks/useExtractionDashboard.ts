import { useQuery } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiFurnaceRepository } from "@/app/core/infrastructure/repositories/ApiFurnaceRepository";
import { GetFurnacesByCompanyUseCase } from "@/app/core/application/use-cases/GetFurnacesByCompanyUseCase";

const furnaceRepository = new ApiFurnaceRepository();
const getFurnacesUseCase = new GetFurnacesByCompanyUseCase(furnaceRepository);

export function useExtractionDashboard() {
  const { activeCompany, isLoadingContext } = useBusiness();

  const { data: furnaces = [], isLoading, error, refetch } = useQuery({
    queryKey: ['extraction-dashboard', activeCompany?.id],
    queryFn: () => getFurnacesUseCase.execute(activeCompany!.id),
    enabled: !!activeCompany?.id && !isLoadingContext,
  });

  return {
    furnaces,
    isLoading: isLoading || isLoadingContext,
    error,
    refetch,
    activeCompany
  };
}
