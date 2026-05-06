import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import { useTheme, alpha } from '@mui/material/styles';

// Components
import KPICard from '../../components/KPICard';
import BatchProgression from '../../components/BatchProgression';
import ShiftAllocation from '../../components/ShiftAllocation';
import QualityControlDistribution from '../../components/QualityControlDistribution';
import PassFailSummary from '../../components/PassFailSummary';
import RecentInspectionsTable from '../../components/RecentInspectionsTable';

export default function BoardsView() {
    const [activeSubTab, setActiveSubTab] = useState(0);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ width: '100%', pt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Sub-tabs for Boards (Holded style) */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#eceef0', p: 0.5, borderRadius: 1.5 }}>
                        {['Resumen', 'Equipo', 'Proyectos'].map((label, index) => (
                            <Button
                                key={label}
                                onClick={() => setActiveSubTab(index)}
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    backgroundColor: activeSubTab === index ? (isDark ? 'primary.main' : '#191c1e') : 'transparent',
                                    color: activeSubTab === index ? '#ffffff' : 'text.secondary',
                                    minWidth: 'auto',
                                    '&:hover': {
                                        backgroundColor: activeSubTab === index ? (isDark ? 'primary.dark' : '#191c1e') : (isDark ? alpha(theme.palette.background.default, 0.8) : '#e6e8ea')
                                    }
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', height: 24, mx: 1 }} />
                    <Button
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                        sx={{ fontSize: 13, fontWeight: 600, textTransform: 'none', color: 'text.secondary', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
                    >
                        Nuevo tablero
                    </Button>
                </Box>
                <Button
                    variant="text"
                    startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                    sx={{ fontSize: 13, fontWeight: 600, textTransform: 'none', color: 'primary.main' }}
                >
                    Añadir
                </Button>
            </Box>

            {/* KPI Cards Grid (Holded style) */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <HoldedKPICard title="Ventas" subtitle="Año actual" value="33.330,00€" target="0% del objetivo" targetColor={theme.palette.success.main} />
                <HoldedKPICard title="Gastos" subtitle="Año actual" value="0,00€" target="0% del objetivo" targetColor={theme.palette.error.main} />
                <HoldedKPICard title="Beneficio" subtitle="Año actual" value="33.330,00€" />
                <Paper 
                    sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1, 
                        boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        textAlign: 'center', 
                        gap: 1, 
                        backgroundColor: 'background.paper' 
                    }}
                >
                     <Box sx={{ position: 'relative' }}>
                        <Box sx={{ width: 32, height: 32, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:building-library</FuseSvgIcon>
                        </Box>
                        <Box sx={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, backgroundColor: 'error.main', borderRadius: '50%', border: '2px solid', borderColor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700 }}>1</Box>
                     </Box>
                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>Crea tu primer banco</Typography>
                     <Typography sx={{ fontSize: 11, color: 'text.secondary', maxWidth: 180 }}>Conecta Holded con tus bancos para relacionar movimientos.</Typography>
                </Paper>
            </Box>

            {/* Production & Quality Sections */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: 3 }}>
                <Box sx={{ gridColumn: { lg: 'span 8' } }}>
                    <BatchProgression />
                </Box>
                <Box sx={{ gridColumn: { lg: 'span 4' } }}>
                    <ShiftAllocation />
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: 3 }}>
                <Box sx={{ gridColumn: { lg: 'span 8' } }}>
                    <QualityControlDistribution />
                </Box>
                <Box sx={{ gridColumn: { lg: 'span 4' } }}>
                    <PassFailSummary />
                </Box>
            </Box>

            {/* Table */}
            <Box>
                <RecentInspectionsTable />
            </Box>

        </Box>
    );
}

function HoldedKPICard({ title, subtitle, value, target, targetColor }: any) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper 
            sx={{ 
                p: 2.5, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1, 
                boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)', 
                backgroundColor: 'background.paper' 
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{subtitle}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
                {target && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>0% del objetivo</Typography>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: targetColor || 'text.primary' }}>0,00€</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
