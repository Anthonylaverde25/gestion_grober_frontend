import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface MachineAreaChartProps {
    machineName: string;
    data: any[];
    color: string;
    articleName?: string;
}

export default function MachineAreaChart({ machineName, data, color, articleName }: MachineAreaChartProps) {
    return (
        <Paper sx={{ p: 3, border: '1px solid #c1c6d7', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#191c1e' }}>{machineName}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#727786' }}>{articleName || 'Sin artículo asignado'}</Typography>
                </Box>
                <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1, backgroundColor: `${color}15`, border: `1px solid ${color}` }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: color }}>Área de Análisis</Typography>
                </Box>
            </Box>

            <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color-${machineName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef0" />
                        <XAxis 
                            dataKey="measuredAt" 
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
                            }}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#727786', fontSize: 11 }}
                            minTickGap={60}
                        />
                        <YAxis 
                            domain={[65, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#727786', fontSize: 11 }}
                            unit="%"
                            tickCount={8}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #c1c6d7', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelFormatter={(label) => new Date(label).toLocaleString('es-AR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Eficiencia de Extracción']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="percentage" 
                            stroke={color} 
                            fillOpacity={1} 
                            fill={`url(#color-${machineName})`} 
                            strokeWidth={3}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
