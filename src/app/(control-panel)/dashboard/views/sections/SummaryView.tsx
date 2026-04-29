import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useSession from '@/hooks/useSession';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Buenos Aires', production: 94.2, color: '#0058c2' },
    { name: 'Córdoba', production: 72.1, color: '#ca4e00' },
    { name: 'Rosario', production: 88.5, color: '#0058c2' },
    { name: 'Mendoza', production: 65.4, color: '#ba1a1a' },
    { name: 'Tucumán', production: 82.0, color: '#0058c2' },
];

interface CompanyMetricProps {
    name: string;
    subtitle: string;
    value: string;
    targetLabel: string;
    targetValue: string;
    statusColor: string;
}

function HoldedCompanyCard({ name, subtitle, value, targetLabel, targetValue, statusColor }: CompanyMetricProps) {
    return (
        <Paper sx={{ p: 2.5, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#191c1e' }}>{name}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#727786' }}>{subtitle}</Typography>
                </Box>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor, mt: 0.5 }} />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#191c1e' }}>{value}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography sx={{ fontSize: 11, color: '#727786' }}>{targetLabel}</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#4e6070' }}>{targetValue}</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default function SummaryView() {
    const { user = { displayName: 'Anthony' } } = useSession()

    return (
        <Box sx={{ maxWidth: 1600, mx: 'auto', width: '100%', pt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Greeting & Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#191c1e', mb: 1 }}>
                        ¡Hola, {user.displayName}!
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#4e6070' }}>Aquí tienes un resumen rápido del estado operativo de tus plantas.</Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<FuseSvgIcon size={18}>heroicons-outline:plus-circle</FuseSvgIcon>}
                    sx={{
                        borderColor: '#c1c6d7',
                        color: '#191c1e',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 13,
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        '&:hover': {
                            borderColor: '#727786',
                            backgroundColor: '#f2f4f6'
                        }
                    }}
                >
                    Añadir elemento
                </Button>
            </Box>

            {/* Section: Resumen por Empresa/Planta */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#191c1e' }}>Estado de Unidades Productivas</Typography>
                    <Button size="small" sx={{ textTransform: 'none', fontWeight: 600, fontSize: 12, color: '#0058c2' }}>Ver todas las plantas</Button>
                </Box>
                <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                    <HoldedCompanyCard 
                        name="Planta Buenos Aires" 
                        subtitle="Producción Real"
                        value="94.2%" 
                        targetLabel="vs Objetivo"
                        targetValue="95.0%"
                        statusColor="#16a34a" 
                    />
                    <HoldedCompanyCard 
                        name="Planta Córdoba" 
                        subtitle="Producción Real"
                        value="72.1%" 
                        targetLabel="vs Objetivo"
                        targetValue="85.0%"
                        statusColor="#ca4e00" 
                    />
                    <HoldedCompanyCard 
                        name="Logística Rosario" 
                        subtitle="Eficiencia"
                        value="88.5%" 
                        targetLabel="vs Objetivo"
                        targetValue="90.0%"
                        statusColor="#16a34a" 
                    />
                    <HoldedCompanyCard 
                        name="Calidad Global" 
                        subtitle="Tasa Aceptación"
                        value="98.8%" 
                        targetLabel="vs Objetivo"
                        targetValue="99.0%"
                        statusColor="#16a34a" 
                    />
                </Box>
            </Box>

            {/* Section: Comparativa de Producción (Recharts) */}
            <Box>
                <Paper sx={{ p: 4, border: '1px solid #c1c6d7', borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#191c1e' }}>Comparativa de Producción por Planta</Typography>
                        <Typography sx={{ fontSize: 13, color: '#727786' }}>Rendimiento porcentual respecto a la capacidad instalada</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#727786', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#727786', fontSize: 12, fontWeight: 500 }}
                                    unit="%"
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8f9fb' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #c1c6d7', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                />
                                <Bar 
                                    dataKey="production" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>

            {/* Section: Banner IA */}
            <Box>
                <Paper
                    sx={{
                        p: 0,
                        border: '1px solid #c1c6d7',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        backgroundColor: '#eef2ff'
                    }}
                >
                    <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{
                            backgroundColor: '#191c1e',
                            color: '#fff',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: 10,
                            fontWeight: 700,
                            alignSelf: 'start',
                            mb: 2
                        }}>
                            IA PREDICTIVA
                        </Box>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#191c1e', mb: 2 }}>
                            Prevé cuellos de botella en la Planta Córdoba
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: '#4e6070', mb: 4, maxWidth: 400 }}>
                            Nuestros algoritmos sugieren que la línea 02 podría fallar en las próximas 48 horas. Revisa el plan de mantenimiento.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#0058c2',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                alignSelf: 'start',
                                px: 3,
                                py: 1
                            }}
                        >
                            Ver Plan de Mantenimiento
                        </Button>
                    </Box>
                    <Box sx={{ width: '40%', position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                            alt="Factory"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                </Paper>
            </Box>

            {/* Section: Acciones Pendientes */}
            <Box>
                <Paper sx={{ p: 0, border: '1px solid #c1c6d7', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid #eceef0' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#191c1e' }}>Alertas de Calidad Pendientes</Typography>
                    </Box>
                    <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, backgroundColor: '#ffdad6', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ba1a1a' }}>
                            <FuseSvgIcon size={20}>heroicons-outline:exclamation-triangle</FuseSvgIcon>
                        </Box>
                        <Typography sx={{ fontSize: 14, color: '#414754', flex: 1 }}>3 desviaciones de calidad detectadas hoy en Planta Córdoba</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0058c2', cursor: 'pointer' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Revisar Alertas</Typography>
                            <FuseSvgIcon size={14}>heroicons-outline:chevron-right</FuseSvgIcon>
                        </Box>
                    </Box>
                </Paper>
            </Box>

        </Box>
    );
}
