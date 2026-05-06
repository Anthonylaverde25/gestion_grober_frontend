import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

interface GlobalRadarChartProps {
    machines: any[];
    chartData: any[];
}

export default function GlobalRadarChart({ machines, chartData }: GlobalRadarChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Obtener el último valor disponible para cada máquina recorriendo el historial hacia atrás
    const values = machines.map(machine => {
        for (let i = chartData.length - 1; i >= 0; i--) {
            if (chartData[i][machine.name] !== undefined) {
                return chartData[i][machine.name];
            }
        }
        return 0;
    });

    const indicator = machines.map(m => ({
        name: m.name,
        max: 100
    }));

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: isDark ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.98)',
            textStyle: { color: theme.palette.text.primary, fontSize: 12 }
        },
        radar: {
            indicator: indicator,
            radius: '65%',
            splitNumber: 5,
            axisName: {
                color: theme.palette.text.secondary,
                fontWeight: 700,
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: theme.palette.divider
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: isDark ? [alpha(theme.palette.background.default, 0.2), alpha(theme.palette.background.default, 0.4)] : ['#f8fafc', '#fff']
                }
            },
            axisLine: {
                lineStyle: {
                    color: theme.palette.divider
                }
            }
        },
        series: [{
            name: 'Eficiencia Actual',
            type: 'radar',
            data: [{
                value: values,
                name: 'Estado de Planta',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: theme.palette.primary.main
                },
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    color: alpha(theme.palette.primary.main, 0.2)
                }
            }]
        }]
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ 
                mb: 0, px: 3, py: 2, 
                backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f1f5f9', 
                borderLeft: '4px solid',
                borderLeftColor: 'text.primary',
                borderTop: '1px solid',
                borderRight: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.2 }}>Balance Operativo</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>Simetría de Producción</Typography>
            </Box>
            <Box sx={{ p: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <ReactECharts option={option} style={{ height: '400px', width: '100%', maxWidth: '600px' }} />
            </Box>
        </Box>
    );
}
