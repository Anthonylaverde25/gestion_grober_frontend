import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import { useExtractionsOverview, TimeRange } from '@/app/features/extraction/hooks/useExtractionsOverview';
import Skeleton from '@mui/material/Skeleton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MachineECharts from '../../components/MachineECharts';
import GlobalECharts from '../../components/GlobalECharts';
import GlobalHeatmapChart from '../../components/GlobalHeatmapChart';
import GlobalRadarChart from '../../components/GlobalRadarChart';
import useSession from '@/hooks/useSession';

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function SummaryView() {
    const { user = { displayName: 'Anthony' } } = useSession();
    const { 
        machines, 
        machineHistories, 
        chartData, 
        isLoading, 
        activeCompany, 
        timeRange, 
        setTimeRange 
    } = useExtractionsOverview();

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
                        ¡Hola, {user.displayName}!
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                        Planta: <strong>{activeCompany?.name}</strong> • Sistema de Análisis de Producción
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

            {/* Section: Comparativa Global (Area) */}
            <GlobalECharts machines={machines} chartData={chartData} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' }, gap: 4 }}>
                <GlobalHeatmapChart machines={machines} chartData={chartData} />
                <GlobalRadarChart machines={machines} chartData={chartData} />
            </Box>

            {/* Section: Detalle Individual por Máquina */}
            <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: '0.1em', mb: 1 }}>DETALLE TÉCNICO</Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0f172a', mb: 4 }}>Análisis por Línea de Producción</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {machineHistories.map((history, index) => (
                        <MachineECharts 
                            key={`echarts-${history.machine.id}`}
                            machineId={history.machine.id}
                            machineName={history.machine.name}
                            data={history.data}
                            color={MACHINE_COLORS[index % MACHINE_COLORS.length]}
                            articleName={history.data[history.data.length - 1]?.articleName}
                        />
                    ))}
                </Box>
            </Box>

            {/* Section: Banner IA */}
            <Box sx={{ mt: 6 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 0,
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        overflow: 'hidden',
                        display: 'flex',
                        backgroundColor: '#f8fafc'
                    }}
                >
                    <Box sx={{ p: 6, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{
                            backgroundColor: '#0f172a',
                            color: '#fff',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: 10,
                            fontWeight: 800,
                            alignSelf: 'start',
                            mb: 2,
                            letterSpacing: '0.05em'
                        }}>
                            IA PREDICTIVA
                        </Box>
                        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0f172a', mb: 2 }}>
                            Prevé cuellos de botella en la Planta Córdoba
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: '#64748b', mb: 4, maxWidth: 500, lineHeight: 1.6 }}>
                            Nuestros algoritmos sugieren que la línea 02 podría fallar en las próximas 48 horas debido a vibraciones térmicas. Revisa el plan de mantenimiento preventivo.
                        </Typography>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                backgroundColor: '#0f172a',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                alignSelf: 'start',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                '&:hover': { backgroundColor: '#1e293b' }
                            }}
                        >
                            Ver Plan de Mantenimiento
                        </Button>
                    </Box>
                    <Box sx={{ width: '35%', position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                            alt="Factory"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        />
                    </Box>
                </Paper>
            </Box>

            {/* Section: Acciones Pendientes */}
            <Box sx={{ mt: 4, mb: 8 }}>
                <Paper elevation={0} sx={{ p: 0, border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Alertas de Calidad Críticas</Typography>
                    </Box>
                    <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3, backgroundColor: '#fff' }}>
                        <Box sx={{ width: 48, height: 48, backgroundColor: '#fef2f2', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', border: '1px solid #fee2e2' }}>
                            <FuseSvgIcon size={24}>heroicons-outline:exclamation-triangle</FuseSvgIcon>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>3 desviaciones de calidad detectadas</Typography>
                            <Typography sx={{ fontSize: 13, color: '#64748b' }}>Planta Córdoba • Línea 03 • Última actualización: hace 12 min</Typography>
                        </Box>
                        <Button
                            sx={{ textTransform: 'none', fontWeight: 700, fontSize: 13, color: '#0058c2' }}
                            endIcon={<FuseSvgIcon size={16}>heroicons-outline:chevron-right</FuseSvgIcon>}
                        >
                            Revisar Alertas
                        </Button>
                    </Box>
                </Paper>
            </Box>

        </Box>
    );
}
