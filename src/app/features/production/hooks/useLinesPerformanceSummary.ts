import { useQuery } from '@tanstack/react-query';
import { ApiDashboardRepository } from '@/app/core/infrastructure/repositories/ApiDashboardRepository';
import { QUERY_KEYS } from '@/app/core/infrastructure/QueryKeys';
import { useBusiness } from '@/app/contexts/BusinessContext';

export const useLinesPerformanceSummary = () => {
    const { activeCompany } = useBusiness();
    const dashboardRepository = new ApiDashboardRepository();

    const { data, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.dashboard.linesPerformanceSummary(activeCompany?.id),
        queryFn: () => dashboardRepository.getLinesPerformanceSummary(activeCompany?.id),
        refetchInterval: 60000, // Refresh every minute
        enabled: !!activeCompany?.id, // Solo ejecutar si hay compañía activa
    });

    return { data, isLoading, error };
};
