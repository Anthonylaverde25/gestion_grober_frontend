import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Skeleton from '@mui/material/Skeleton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useYieldOverview, TimeRange } from '@/app/features/production/hooks/useYieldOverview';
import useSession from '@/hooks/useSession';
import MachineYieldECharts from '../../components/MachineYieldECharts';
import GlobalECharts from '../../components/GlobalECharts';
import { useState, useMemo } from 'react';
import { useTheme, alpha } from '@mui/material/styles';

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function YieldView() {
    const { user = { displayName: 'Anthony' } } = useSession();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        machines,
        machineHistories,
        chartData,
        isLoading,
        activeCompany,
        timeRange,
        setTimeRange
    } = useYieldOverview();

    const [showOnlyActive, setShowOnlyActive] = useState(false);

    const handleTimeRangeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newRange: TimeRange | null,
    ) => {
        if (newRange !== null) {
            setTimeRange(newRange);
        }
    };

    // Filtramos las máquinas que tienen campaña activa si el filtro está habilitado
    const filteredMachineHistories = useMemo(() => {
        if (!showOnlyActive) return machineHistories;
        return machineHistories.filter(history => history.machine.currentCampaignId);
    }, [machineHistories, showOnlyActive]);

    const filteredMachines = useMemo(() => {
        if (!showOnlyActive) return machines;
        return machines.filter(m => m.currentCampaignId);
    }, [machines, showOnlyActive]);

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
                    <Typography sx={{ fontSize: 24, fontWeight: 700, color: 'text.primary' }}>
                        Rendimiento de Líneas
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                        Planta: <Box component="strong" sx={{ color: 'text.primary' }}>{activeCompany?.name}</Box> • Seguimiento de Forming & Packing Yield
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={showOnlyActive} 
                                onChange={(e) => setShowOnlyActive(e.target.checked)}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'primary.main' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'primary.main' }
                                }}
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                                Solo con Campaña Activa
                            </Typography>
                        }
                    />

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
                                color: 'text.secondary',
                                fontWeight: 600,
                                fontSize: 12,
                                '&.Mui-selected': {
                                    backgroundColor: isDark ? 'primary.main' : '#f1f5f9',
                                    color: isDark ? 'primary.contrastText' : 'text.primary',
                                    '&:hover': { backgroundColor: isDark ? 'primary.dark' : '#e2e8f0' }
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
            </Box>

            {/* Section: Comparativa Global (Average Yield) */}
            <GlobalECharts machines={filteredMachines} chartData={chartData} />

            {/* Section: Detalle Individual por Máquina */}
            <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em', mb: 1, textTransform: 'uppercase' }}>Eficiencia Operativa</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: 'text.primary', mb: 4 }}>Desempeño por Línea de Producción</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {filteredMachineHistories.map((history, index) => (
                        <MachineYieldECharts
                            key={`yield-charts-${history.machine.id}`}
                            machineId={history.machine.id}
                            machineName={history.machine.name}
                            data={history.data}
                            color={MACHINE_COLORS[index % MACHINE_COLORS.length]}
                            articleName={machines?.find(m => m.id === history.machine.id)?.currentArticleName || 'NO APLICA'}
                        />
                    ))}
                </Box>
            </Box>

        </Box>
    );
}
