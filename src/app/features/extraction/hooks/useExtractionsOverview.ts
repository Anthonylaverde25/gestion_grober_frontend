import { useQuery, useQueries } from "@tanstack/react-query";
import { useBusiness } from "@/app/contexts/BusinessContext";
import { ApiMachineRepository } from "@/app/core/infrastructure/repositories/ApiMachineRepository";
import { ApiExtractionRepository } from "@/app/core/infrastructure/repositories/ApiExtractionRepository";
import { GetMachinesByCompanyUseCase } from "@/app/core/application/use-cases/GetMachinesByCompanyUseCase";
import { GetExtractionHistoryUseCase } from "@/app/core/application/use-cases/GetExtractionHistoryUseCase";
import { useMemo, useState } from "react";
import { format, startOfHour, startOfDay, startOfWeek, subDays, subMonths } from "date-fns";

const machineRepository = new ApiMachineRepository();
const extractionRepository = new ApiExtractionRepository();

const getMachinesUseCase = new GetMachinesByCompanyUseCase(machineRepository);
const getExtractionsUseCase = new GetExtractionHistoryUseCase(extractionRepository);

export type TimeRange = 'hour' | 'day' | 'week' | 'month';

export function useExtractionsOverview() {
    const { activeCompany, isLoadingContext } = useBusiness();
    const [timeRange, setTimeRange] = useState<TimeRange>('hour');

    // Mapeo de límites según el rango (basado en producción horaria)
    const rangeConfig = {
        hour: { limit: 24, format: 'HH:mm' },     // Últimas 24 horas
        day: { limit: 24 * 7, format: 'dd MMM' }, // Últimos 7 días
        week: { limit: 24 * 30, format: 'dd/MM' }, // Últimos 30 días
        month: { limit: 24 * 60, format: 'MMM yy' } // Últimos 60 días (histórico completo)
    };

    const { data: machines = [], isLoading: isLoadingMachines } = useQuery({
        queryKey: ['dashboard-machines', activeCompany?.id],
        queryFn: () => getMachinesUseCase.execute(activeCompany!.id),
        enabled: !!activeCompany?.id && !isLoadingContext,
    });

    const extractionQueries = useQueries({
        queries: machines.map(machine => ({
            queryKey: ['machine-history', machine.id, timeRange],
            queryFn: () => getExtractionsUseCase.execute(machine.id, rangeConfig[timeRange].limit),
            staleTime: 1000 * 60 * 5,
        }))
    });

    const isLoadingExtractions = extractionQueries.some(q => q.isLoading);
    
    const chartData = useMemo(() => {
        if (isLoadingExtractions || machines.length === 0) return [];

        const timeMap: Record<string, any> = {};
        const dateFormat = rangeConfig[timeRange].format;

        extractionQueries.forEach((query, index) => {
            const machine = machines[index];
            const extractions = query.data || [];

            extractions.forEach(ext => {
                const timeStr = format(ext.measuredAt, dateFormat);
                if (!timeMap[timeStr]) {
                    timeMap[timeStr] = { time: timeStr, fullDate: ext.measuredAt };
                }
                // Si hay múltiples registros en el mismo label (ej. varios en un día), promediamos o tomamos el último
                timeMap[timeStr][machine.name] = ext.percentage;
            });
        });

        return Object.values(timeMap).sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());
    }, [extractionQueries, machines, isLoadingExtractions, timeRange]);

    return {
        machines,
        timeRange,
        setTimeRange,
        machineHistories: extractionQueries.map((q, i) => ({
            machine: machines[i],
            data: (q.data || []).slice().reverse() // Invertir para que Recharts lea cronológicamente
        })),
        chartData,
        isLoading: isLoadingMachines || isLoadingExtractions || isLoadingContext,
        activeCompany
    };
}
