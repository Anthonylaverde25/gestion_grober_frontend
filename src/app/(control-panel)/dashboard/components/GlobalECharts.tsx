import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useRef } from 'react';

interface GlobalEChartsProps {
    machines: any[];
    chartData: any[];
}

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function GlobalECharts({ machines, chartData }: GlobalEChartsProps) {
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
                const url = echartsInstance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' });
                const link = document.createElement('a');
                link.download = 'Comparativa-Global.png';
                link.href = url;
                link.click();
                break;
        }
    };

    const option = {
        toolbox: { show: false },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderWidth: 0,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.1)',
            textStyle: { color: '#191c1e', fontSize: 12, fontWeight: 500 }
        },
        legend: {
            data: machines.map(m => m.name),
            top: 0,
            itemWidth: 12,
            itemHeight: 12,
            icon: 'circle',
            textStyle: { color: '#727786', fontSize: 11, fontWeight: 600 }
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
            axisLabel: { color: '#64748b', fontSize: 11, margin: 15 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: true, lineStyle: { color: '#e2e8f0', type: 'solid' } }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: { formatter: '{value}%', color: '#64748b', fontSize: 11 },
            splitLine: { show: true, lineStyle: { color: '#e2e8f0', type: 'solid' } }
        },
        dataZoom: [
            { type: 'inside', start: 0, end: 100 },
            { 
                type: 'slider', 
                bottom: 10, 
                height: 24, 
                borderColor: 'transparent',
                backgroundColor: '#f1f5f9',
                fillerColor: 'rgba(15, 23, 42, 0.1)',
                handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                showDetail: false
            }
        ],
        series: machines.map((machine, index) => ({
            name: machine.name,
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: { width: 2, color: MACHINE_COLORS[index % MACHINE_COLORS.length] },
            areaStyle: {
                opacity: 0.08,
                color: MACHINE_COLORS[index % MACHINE_COLORS.length]
            },
            data: chartData.map(d => d[machine.name])
        }))
    };

    return (
        <Box ref={containerRef} sx={{ mb: 4, backgroundColor: '#fff' }}>
            <Box sx={{ 
                mb: 2, px: 3, py: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#f1f5f9', borderRadius: 0, border: '1px solid #e2e8f0',
                borderLeft: '4px solid #0f172a'
            }}>
                <Box>
                    <Typography sx={{ fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', mb: 0.2 }}>Tendencia Operativa</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Eficiencia Global Comparada</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Zoom">
                        <IconButton size="small" onClick={() => handleAction('zoom')} sx={{ color: '#64748b' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:magnifying-glass-plus</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Resetear">
                        <IconButton size="small" onClick={() => handleAction('restore')} sx={{ color: '#64748b' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:arrow-path</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Pantalla Completa">
                        <IconButton size="small" onClick={() => handleAction('fullscreen')} sx={{ color: '#64748b' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:arrows-pointing-out</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar">
                        <IconButton size="small" onClick={() => handleAction('download')} sx={{ color: '#64748b' }}>
                            <FuseSvgIcon size={18}>heroicons-outline:camera</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ py: 2, px: 2, backgroundColor: '#fff', position: 'relative' }}>
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
