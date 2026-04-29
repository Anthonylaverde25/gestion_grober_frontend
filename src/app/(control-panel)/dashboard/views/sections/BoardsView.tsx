import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'motion/react';
import { useState } from 'react';

// Components
import KPICard from '../../components/KPICard';
import BatchProgression from '../../components/BatchProgression';
import ShiftAllocation from '../../components/ShiftAllocation';
import QualityControlDistribution from '../../components/QualityControlDistribution';
import PassFailSummary from '../../components/PassFailSummary';
import RecentInspectionsTable from '../../components/RecentInspectionsTable';

export default function BoardsView() {
    const [activeSubTab, setActiveSubTab] = useState(0);

    return (
        <Box sx={{ width: '100%', pt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Sub-tabs for Boards (Holded style) */}
            <Box className="flex items-center justify-between border-b border-slate-200 pb-12">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: '#eceef0', p: 0.5, borderRadius: 1.5 }}>
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
                                    backgroundColor: activeSubTab === index ? '#191c1e' : 'transparent',
                                    color: activeSubTab === index ? '#ffffff' : '#4e6070',
                                    minWidth: 'auto',
                                    '&:hover': {
                                        backgroundColor: activeSubTab === index ? '#191c1e' : '#e6e8ea'
                                    }
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ borderLeft: '1px solid #c1c6d7', height: 24, mx: 1 }} />
                    <Button
                        startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                        sx={{ fontSize: 13, fontWeight: 600, textTransform: 'none', color: '#4e6070', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
                    >
                        Nuevo tablero
                    </Button>
                </Box>
                <Button
                    variant="text"
                    startIcon={<FuseSvgIcon size={16}>heroicons-outline:plus</FuseSvgIcon>}
                    sx={{ fontSize: 13, fontWeight: 600, textTransform: 'none', color: '#0058c2' }}
                >
                    Añadir
                </Button>
            </Box>

            {/* KPI Cards Grid (Holded style) */}
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
                <HoldedKPICard title="Ventas" subtitle="Año actual" value="33.330,00€" target="0% del objetivo" targetColor="text-green-600" />
                <HoldedKPICard title="Gastos" subtitle="Año actual" value="0,00€" target="0% del objetivo" targetColor="text-red-600" />
                <HoldedKPICard title="Beneficio" subtitle="Año actual" value="33.330,00€" />
                <Paper sx={{ p: 2, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 1, backgroundColor: '#fff' }}>
                     <Box sx={{ position: 'relative' }}>
                        <Box sx={{ width: 32, height: 32, backgroundColor: '#fff', border: '1px solid #c1c6d7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#727786' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:building-library</FuseSvgIcon>
                        </Box>
                        <Box sx={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, backgroundColor: '#ba1a1a', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700 }}>1</Box>
                     </Box>
                     <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0058c2' }}>Crea tu primer banco</Typography>
                     <Typography sx={{ fontSize: 11, color: '#727786', maxWidth: 180 }}>Conecta Holded con tus bancos para relacionar movimientos.</Typography>
                </Paper>
            </Box>

            {/* Production & Quality Sections (Requested to insert here) */}
            <Box className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <BatchProgression />
                </div>
                <div className="lg:col-span-4">
                    <ShiftAllocation />
                </div>
            </Box>

            <Box className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    <QualityControlDistribution />
                </div>
                <div className="lg:col-span-4">
                    <PassFailSummary />
                </div>
            </Box>

            {/* Table */}
            <Box>
                <RecentInspectionsTable />
            </Box>

        </Box>
    );
}

function HoldedKPICard({ title, subtitle, value, target, targetColor }: any) {
    return (
        <Paper sx={{ p: 2.5, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#191c1e' }}>{title}</Typography>
                <Typography sx={{ fontSize: 12, color: '#727786' }}>{subtitle}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#191c1e' }}>{value}</Typography>
                {target && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{ fontSize: 11, color: '#727786' }}>0% del objetivo</Typography>
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: targetColor === 'text-green-600' ? '#16a34a' : '#ba1a1a' }}>0,00€</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
