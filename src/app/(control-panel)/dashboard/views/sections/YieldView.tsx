import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Skeleton from '@mui/material/Skeleton';
import { useYieldOverview, TimeRange } from '@/app/features/production/hooks/useYieldOverview';
import useSession from '@/hooks/useSession';
import MachineYieldECharts from '../../components/MachineYieldECharts';
import GlobalECharts from '../../components/GlobalECharts';

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function YieldView() {
    const { user = { displayName: 'Anthony' } } = useSession();
    const { 
        machines, 
        machineHistories, 
        chartData, 
        isLoading, 
        activeCompany, 
        timeRange, 
        setTimeRange 
    } = useYieldOverview();

    const handleTimeRangeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newRange: TimeRange | null,
    ) => {
        if (newRange !== null) {
            setTimeRange(newRange);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ maxWidth: 1600, mx: 'auto', width: '100%', pt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Skeleton variant="rectangular" height={100} />
                <Skeleton variant="rectangular" height={450} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[1, 2].map(i => <Skeleton key={i} variant="rectangular" height={400} />)}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto', width: '100%', pt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Header & Scale Selector */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
                        Rendimiento de Líneas
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                        Planta: <strong>{activeCompany?.name}</strong> • Seguimiento de Forming & Packing Yield
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    value={timeRange}
                    exclusive
                    onChange={handleTimeRangeChange}
                    size="small"
                    sx={{ 
                        backgroundColor: 'transparent',
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: '8px !important',
                            mx: 0.5,
                            color: '#64748b',
                            fontWeight: 600,
                            fontSize: 12,
                            '&.Mui-selected': {
                                backgroundColor: '#f1f5f9',
                                color: '#0f172a',
                                '&:hover': { backgroundColor: '#e2e8f0' }
                            }
                        }
                    }}
                >
                    <ToggleButton value="hour">HORA</ToggleButton>
                    <ToggleButton value="day">DÍA</ToggleButton>
                    <ToggleButton value="week">SEMANA</ToggleButton>
                    <ToggleButton value="month">MES</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Section: Comparativa Global (Average Yield) */}
            <GlobalECharts machines={machines} chartData={chartData} />

            {/* Section: Detalle Individual por Máquina */}
            <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: '0.1em', mb: 1 }}>EFICIENCIA OPERATIVA</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0f172a', mb: 4 }}>Desempeño por Línea de Producción</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {machineHistories.map((history, index) => (
                        <MachineYieldECharts 
                            key={`yield-charts-${history.machine.id}`}
                            machineId={history.machine.id}
                            machineName={history.machine.name}
                            data={history.data}
                            color={MACHINE_COLORS[index % MACHINE_COLORS.length]}
                            articleName={history.articleName}
                        />
                    ))}
                </Box>
            </Box>

        </Box>
    );
}
