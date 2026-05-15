import { useQuery } from '@tanstack/react-query';
import { useBusiness } from '@/app/contexts/BusinessContext';
import { QUERY_KEYS } from '@/app/core/infrastructure/QueryKeys';
import { ApiDashboardRepository } from '@/app/core/infrastructure/repositories/ApiDashboardRepository';

const dashboardRepository = new ApiDashboardRepository();

export function useDashboardOverview() {
  const { activeCompany, isLoadingContext } = useBusiness();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.dashboard.overview(activeCompany?.id),
    queryFn: () => dashboardRepository.getOverview(activeCompany?.id),
    enabled: !!activeCompany?.id && !isLoadingContext,
    refetchInterval: 1000 * 60 * 2, // Refresh every 2 minutes
  });

  return {
    overview: data,
    activeMachines: data?.active_production || [],
    yieldSeries: data?.yield_series || [],
    summary: data?.summary,
    isLoading: isLoading || isLoadingContext,
    error,
    refetch,
    activeCompany
  };
}
