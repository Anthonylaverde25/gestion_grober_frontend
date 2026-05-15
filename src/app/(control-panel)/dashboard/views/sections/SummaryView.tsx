import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import { useDashboardOverview } from '../../api/hooks/useDashboardOverview';
import Skeleton from '@mui/material/Skeleton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MachineECharts from '../../components/MachineECharts';
import ActiveProductionSummary from '../../components/ActiveProductionSummary';
import ActiveYieldComparisonChart from '../../components/ActiveYieldComparisonChart';
import GlobalECharts from '../../components/GlobalECharts';
import GlobalHeatmapChart from '../../components/GlobalHeatmapChart';
import GlobalRadarChart from '../../components/GlobalRadarChart';
import useSession from '@/hooks/useSession';
import { useTheme, alpha } from '@mui/material/styles';

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function SummaryView() {
    const { user = { displayName: 'Anthony' } } = useSession();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        activeMachines,
        yieldSeries,
        isLoading,
        activeCompany
    } = useDashboardOverview();

    if (isLoading) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            p: { xs: 3, md: 5 },
            maxWidth: 1800,
            mx: 'auto',
            backgroundColor: 'background.default',
            minHeight: '100%'
        }}>
            {/* SAP Fiori Object Header Concept */}
            <Box sx={{ 
                mb: 5,
                pb: 3,
                borderBottom: '1px solid',
                borderColor: isDark ? alpha(theme.palette.divider, 0.5) : '#e2e8f0',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}>
                <Box>
                    <Typography sx={{ 
                        fontSize: { xs: 24, md: 32 }, 
                        fontWeight: 800, 
                        color: 'text.primary', 
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                    }}>
                        Planta {activeCompany?.name || 'Cargando...'}
                    </Typography>
                </Box>
            </Box>

            {/* Section: Consola Unificada de Operaciones (Gráfico + Tabla) */}
            <Box sx={{ width: '100%', mb: 6 }}>
                <ActiveYieldComparisonChart
                    yieldSeries={yieldSeries}
                    machines={activeMachines as any}
                />
            </Box>

            {/* Footer Insights Grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 4
            }}>
                {/* AI Predictive Card (Analytical Style) */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        border: '1px solid',
                        borderColor: isDark ? 'divider' : '#e2e8f0',
                        borderRadius: 2,
                        backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.4) : '#ffffff',
                        display: 'flex',
                        gap: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 4,
                            height: '100%',
                            bgcolor: 'secondary.main'
                        }
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            color: 'secondary.main',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 0.5,
                            fontSize: 10,
                            fontWeight: 800,
                            display: 'inline-block',
                            mb: 2,
                            letterSpacing: '0.05em'
                        }}>
                            INTELIGENCIA OPERATIVA
                        </Box>
                        <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 1.5 }}>
                            Optimización de Mantenimiento Preventivo
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3, lineHeight: 1.6, maxWidth: 600 }}>
                            Basado en los últimos datos de vibración y temperatura, se recomienda una inspección en los rodamientos de la <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>Línea 02</Box>. Probabilidad de falla: 12% en las próximas 48h.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            disableElevation
                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5, px: 3 }}
                        >
                            Ver Recomendaciones
                        </Button>
                    </Box>
                    <Box sx={{ width: '25%', display: { xs: 'none', xl: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                        <FuseSvgIcon size={120} sx={{ color: alpha(theme.palette.secondary.main, 0.15) }}>heroicons-outline:beaker</FuseSvgIcon>
                    </Box>
                </Paper>

                {/* Quality Alerta Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        border: '1px solid',
                        borderColor: isDark ? 'divider' : '#e2e8f0',
                        borderRadius: 2,
                        backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.4) : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        borderLeft: '4px solid',
                        borderLeftColor: 'error.main'
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'error.main', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Alertas de Calidad
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'error.main'
                        }}>
                            <FuseSvgIcon size={20}>heroicons-outline:shield-exclamation</FuseSvgIcon>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>3 Desviaciones Detectadas</Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Última hace 15 minutos</Typography>
                        </Box>
                    </Box>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{ mt: 'auto', textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}
                    >
                        Gestionar Incidencias
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}
