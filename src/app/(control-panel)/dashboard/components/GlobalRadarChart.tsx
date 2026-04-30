import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface GlobalRadarChartProps {
    machines: any[];
    chartData: any[];
}

export default function GlobalRadarChart({ machines, chartData }: GlobalRadarChartProps) {
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
        tooltip: {
            trigger: 'item'
        },
        radar: {
            indicator: indicator,
            radius: '65%',
            splitNumber: 5,
            axisName: {
                color: '#64748b',
                fontWeight: 700,
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: '#e2e8f0'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#f8fafc', '#fff']
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1'
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
                    color: '#0058c2'
                },
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    color: 'rgba(0, 88, 194, 0.15)'
                }
            }]
        }]
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ 
                mb: 2, px: 3, py: 2, 
                backgroundColor: '#f1f5f9', 
                borderLeft: '4px solid #0f172a' 
            }}>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', mb: 0.2 }}>Balance Operativo</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Simetría de Producción</Typography>
            </Box>
            <Box sx={{ p: 4, backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                <ReactECharts option={option} style={{ height: '400px', width: '100%', maxWidth: '600px' }} />
            </Box>
        </Box>
    );
}
