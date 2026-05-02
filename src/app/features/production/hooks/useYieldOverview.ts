import { useQuery, useQueries } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiMachineRepository } from "@/app/core/infrastructure/repositories/ApiMachineRepository";
import { ApiLineYieldRepository } from "@/app/core/infrastructure/repositories/ApiLineYieldRepository";
import { GetMachinesByCompanyUseCase } from "@/app/core/application/use-cases/GetMachinesByCompanyUseCase";
import { GetLineYieldHistoryUseCase } from "@/app/core/application/use-cases/GetLineYieldHistoryUseCase";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { QUERY_KEYS } from "@/app/core/infrastructure/QueryKeys";

const machineRepository = new ApiMachineRepository();
const yieldRepository = new ApiLineYieldRepository();

const getMachinesUseCase = new GetMachinesByCompanyUseCase(machineRepository);
const getYieldsUseCase = new GetLineYieldHistoryUseCase(yieldRepository);

export type TimeRange = 'hour' | 'day' | 'week' | 'month';

const rangeConfig = {
    hour: { limit: 24, format: 'HH:mm' },
    day: { limit: 30, format: 'dd MMM' }, 
    week: { limit: 52, format: 'dd/MM' },
    month: { limit: 24, format: 'MMM yy' }
};

export function useYieldOverview() {
    const { activeCompany, isLoadingContext } = useBusiness();
    const [timeRange, setTimeRange] = useState<TimeRange>('day'); // Default to day for yield

    const { data: machines = [], isLoading: isLoadingMachines } = useQuery({
        queryKey: QUERY_KEYS.production.machines.dashboard(activeCompany?.id!),
        queryFn: () => getMachinesUseCase.execute(activeCompany!.id),
        enabled: !!activeCompany?.id && !isLoadingContext,
    });

    const yieldQueries = useQueries({
        queries: machines.map(machine => ({
            queryKey: QUERY_KEYS.production.yields.machineHistory(machine.id, timeRange),
            queryFn: () => getYieldsUseCase.executeByMachine(machine.id, rangeConfig[timeRange].limit),
            staleTime: 1000 * 60 * 5,
        }))
    });

    const isLoadingYields = yieldQueries.some(q => q.isLoading);
    
    const chartData = useMemo(() => {
        if (isLoadingYields || machines.length === 0) return [];

        const timeMap: Record<string, { time: string; fullDate: Date; [key: string]: string | Date | number }> = {};
        const dateFormat = rangeConfig[timeRange].format;

        yieldQueries.forEach((query, index) => {
            const machine = machines[index];
            const yields = query.data || [];

            yields.forEach(y => {
                const timeStr = format(y.recordedAt, dateFormat);
                if (!timeMap[timeStr]) {
                    timeMap[timeStr] = { time: timeStr, fullDate: y.recordedAt };
                }
                
                const avgYield = (y.formingYield + y.packingYield) / 2;
                timeMap[timeStr][machine.name] = avgYield;
            });
        });

        return Object.values(timeMap).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    }, [yieldQueries, machines, isLoadingYields, timeRange]);

    return {
        machines,
        timeRange,
        setTimeRange,
        machineHistories: yieldQueries.map((q, i) => {
            const data = (q.data || []).slice().reverse();
            return {
                machine: machines[i],
                data,
                articleName: machines[i].currentArticle?.name 
            };
        }),
        chartData,
        isLoading: isLoadingMachines || isLoadingYields || isLoadingContext,
        activeCompany
    };
}
