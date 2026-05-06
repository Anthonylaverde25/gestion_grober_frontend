import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';

interface GlobalEChartsProps {
    machines: any[];
    chartData: any[];
}

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function GlobalECharts({ machines, chartData }: GlobalEChartsProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const chartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAction = (action: string) => {
        const echartsInstance = chartRef.current?.getEchartsInstance();
        if (!echartsInstance) return;

        switch (action) {
            case 'zoom':
                echartsInstance.dispatchAction({ type: 'takeGlobalCursor', key: 'dataZoomSelect', dataZoomSelectActive: true });
                break;
            case 'restore':
                echartsInstance.dispatchAction({ type: 'restore' });
                break;
            case 'fullscreen':
                if (containerRef.current) {
                    if (!document.fullscreenElement) {
                        containerRef.current.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                }
                break;
            case 'download':
                const url = echartsInstance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: isDark ? '#121212' : '#fff' });
                const link = document.createElement('a');
                link.download = 'Comparativa-Global.png';
                link.href = url;
                link.click();
                break;
        }
    };

    const option = {
        backgroundColor: 'transparent',
        toolbox: { show: false },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDark ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.98)',
            borderWidth: 0,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.1)',
            textStyle: { color: theme.palette.text.primary, fontSize: 12, fontWeight: 500 }
        },
        legend: {
            data: machines.map(m => m.name),
            top: 0,
            itemWidth: 12,
            itemHeight: 12,
            icon: 'circle',
            textStyle: { color: theme.palette.text.secondary, fontSize: 11, fontWeight: 600 }
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '15%',
            top: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.map(d => d.time),
            axisLabel: { color: theme.palette.text.secondary, fontSize: 11, margin: 15 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: true, lineStyle: { color: theme.palette.divider, type: 'solid' } }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: { formatter: '{value}%', color: theme.palette.text.secondary, fontSize: 11 },
            splitLine: { show: true, lineStyle: { color: theme.palette.divider, type: 'solid' } }
        },
        dataZoom: [
            { type: 'inside', start: 0, end: 100 },
            {
                type: 'slider',
                bottom: 10,
                height: 24,
                borderColor: 'transparent',
                backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f1f5f9',
                fillerColor: isDark ? alpha(theme.palette.primary.main, 0.2) : 'rgba(15, 23, 42, 0.1)',
                handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                showDetail: false,
                textStyle: { color: theme.palette.text.secondary }
            }
        ],
        series: machines.map((machine, index) => ({
            name: machine.name,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            showSymbol: true,
            lineStyle: { width: 2, color: MACHINE_COLORS[index % MACHINE_COLORS.length] },
            areaStyle: {
                opacity: 0.08,
                color: MACHINE_COLORS[index % MACHINE_COLORS.length]
            },
            data: chartData.map(d => d[machine.name])
        }))
    };

    return (
        <Box ref={containerRef} sx={{ mb: 4, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{
                mb: 0, px: 3, py: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f1f5f9', 
                borderRadius: 0, 
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderLeft: '4px solid',
                borderLeftColor: 'text.primary'
            }}>
                <Box>
                    <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.2 }}>Tendencia Operativa</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'text.primary' }}>Eficiencia Global Comparada</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Zoom">
                        <IconButton size="small" onClick={() => handleAction('zoom')} sx={{ color: 'text.secondary' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:magnifying-glass-plus</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Resetear">
                        <IconButton size="small" onClick={() => handleAction('restore')} sx={{ color: 'text.secondary' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:arrow-path</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Pantalla Completa">
                        <IconButton size="small" onClick={() => handleAction('fullscreen')} sx={{ color: 'text.secondary' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:arrows-pointing-out</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar">
                        <IconButton size="small" onClick={() => handleAction('download')} sx={{ color: 'text.secondary' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:camera</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ py: 2, px: 2, backgroundColor: 'background.paper', position: 'relative' }}>
                <ReactECharts
                    ref={chartRef}
                    option={option}
                    style={{ height: '600px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                />
            </Box>
        </Box>
    );
}
