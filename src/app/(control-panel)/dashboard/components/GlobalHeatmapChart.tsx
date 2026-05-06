import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

interface GlobalHeatmapChartProps {
    machines: any[];
    chartData: any[];
}

export default function GlobalHeatmapChart({ machines, chartData }: GlobalHeatmapChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const machineNames = machines.map(m => m.name);
    const times = chartData.map(d => d.time);
    
    // Transformar datos para el heatmap: [horaIndex, maquinaIndex, valor]
    const data = [];
    chartData.forEach((d, timeIdx) => {
        machineNames.forEach((name, machIdx) => {
            data.push([timeIdx, machIdx, d[name] || 0]);
        });
    });

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            position: 'top',
            backgroundColor: isDark ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.98)',
            textStyle: { color: theme.palette.text.primary, fontSize: 12 },
            formatter: (params: any) => {
                return `${machineNames[params.value[1]]}<br/>Hora: ${times[params.value[0]]}<br/>Eficiencia: <b>${params.value[2]}%</b>`;
            }
        },
        grid: {
            top: '5%',
            bottom: '15%',
            left: '10%',
            right: '2%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: times,
            splitArea: { show: true, areaStyle: { color: isDark ? [alpha(theme.palette.background.default, 0.2), alpha(theme.palette.background.default, 0.4)] : ['#fcfdfe', '#f8f9fa'] } },
            axisLabel: { color: theme.palette.text.secondary, fontSize: 10 },
            axisLine: { show: false }
        },
        yAxis: {
            type: 'category',
            data: machineNames,
            splitArea: { show: true, areaStyle: { color: isDark ? [alpha(theme.palette.background.default, 0.2), alpha(theme.palette.background.default, 0.4)] : ['#fcfdfe', '#f8f9fa'] } },
            axisLabel: { color: theme.palette.text.secondary, fontSize: 11, fontWeight: 600 },
            axisLine: { show: false }
        },
        visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            itemWidth: 15,
            textStyle: { color: theme.palette.text.secondary, fontSize: 10, fontWeight: 700 },
            inRange: {
                color: isDark ? [
                    alpha(theme.palette.error.main, 0.4),
                    alpha(theme.palette.warning.main, 0.6),
                    alpha(theme.palette.success.main, 0.6),
                    theme.palette.success.main
                ] : [
                    '#fee2e2', // Muy bajo (Rojo suave)
                    '#fef3c7', // Medio (Amarillo)
                    '#dcfce7', // Bueno (Verde suave)
                    '#166534'  // Excelente (Verde oscuro)
                ]
            }
        },
        series: [{
            name: 'Eficiencia',
            type: 'heatmap',
            data: data,
            label: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            }
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
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.2 }}>Análisis de Intensidad</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>Mapa de Calor de Planta</Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
            </Box>
        </Box>
    );
}
