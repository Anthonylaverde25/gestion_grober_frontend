import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactECharts from 'echarts-for-react';
import { useTheme, alpha } from '@mui/material/styles';

interface ArticlePerformanceChartProps {
    campaignStats: any[];
    articleName: string;
}

export default function ArticlePerformanceChart({ campaignStats, articleName }: ArticlePerformanceChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const chartRef = useRef<any>(null);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);
    const [showBenchmarks, setShowBenchmarks] = useState(false);

    const toggleSeries = (name: string) => {
        if (chartRef.current) {
            chartRef.current.getEchartsInstance().dispatchAction({ type: 'legendToggleSelect', name });
        }
    };

    const downloadChart = () => {
        if (chartRef.current) {
            const url = chartRef.current.getEchartsInstance().getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: isDark ? theme.palette.background.paper : '#fff' });
            const link = document.createElement('a');
            link.href = url;
            link.download = `Performance_Evolution_250_Campaigns_${articleName}.png`;
            link.click();
        }
    };

    const restoreChart = () => {
        if (chartRef.current) {
            chartRef.current.getEchartsInstance().dispatchAction({ type: 'restore' });
        }
    };

    const toggleFullscreen = () => {
        if (fullscreenContainerRef.current) {
            if (!document.fullscreenElement) {
                fullscreenContainerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting full-screen mode: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    // Promedios históricos
    const avgForming = campaignStats.reduce((acc, curr) => acc + curr.forming, 0) / campaignStats.length;
    const avgPacking = campaignStats.reduce((acc, curr) => acc + curr.packing, 0) / campaignStats.length;

    const chartOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDark ? '#1e293b' : 'rgba(15, 23, 42, 0.9)',
            textStyle: { color: '#fff', fontSize: 11 },
            borderWidth: 0,
            formatter: (params: any) => {
                const campaign = campaignStats[params[0].dataIndex];
                let res = `<div style="padding: 4px">
                    <div style="font-weight: 900; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px">${campaign.code}</div>
                    <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px">Periodo: ${campaign.date} | Línea: ${campaign.line}</div>`;
                params.forEach((p: any) => {
                    res += `<div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 2px">
                        <div style="display: flex; align-items: center; gap: 6px">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${p.color}"></div>
                            <span style="font-size: 11px">${p.seriesName.toUpperCase()}:</span>
                        </div>
                        <b style="font-size: 12px; font-family: monospace">${p.value.toFixed(1)}%</b>
                    </div>`;
                });
                res += `</div>`;
                return res;
            }
        },
        grid: { top: 40, bottom: 80, left: 50, right: 30 },
        dataZoom: [
            { type: 'inside', start: 90, end: 100 },
            { 
                start: 90, end: 100, bottom: 0, height: 20, 
                handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: { color: theme.palette.divider, shadowBlur: 3, shadowColor: 'rgba(0, 0, 0, 0.3)' },
                textStyle: { color: 'transparent' },
                fillerColor: alpha(theme.palette.primary.main, 0.1),
                borderColor: theme.palette.divider
            }
        ],
        xAxis: {
            type: 'category',
            data: campaignStats.map(c => c.code.split('-').slice(2).join('-')),
            axisLine: { lineStyle: { color: theme.palette.divider, width: 2 } },
            axisTick: { show: true, lineStyle: { color: theme.palette.divider } },
            splitLine: { show: true, lineStyle: { type: 'solid', color: isDark ? alpha(theme.palette.divider, 0.5) : '#e2e8f0', width: 1 } },
            axisLabel: { fontWeight: 800, color: theme.palette.text.secondary, fontSize: 8, rotate: 45, interval: 'auto' },
            boundaryGap: true
        },
        yAxis: {
            type: 'value',
            min: 75,
            max: 100,
            axisLine: { show: true, lineStyle: { color: theme.palette.divider, width: 2 } },
            splitLine: { show: true, lineStyle: { type: 'solid', color: isDark ? alpha(theme.palette.divider, 0.5) : '#e2e8f0', width: 1 } },
            axisLabel: { fontWeight: 700, color: theme.palette.text.secondary, fontSize: 10, formatter: '{value}%' }
        },
        series: [
            {
                name: 'Forming',
                type: 'line',
                smooth: 0.3,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: { color: isDark ? '#f8fafc' : '#0f172a', borderWidth: 1, borderColor: theme.palette.background.paper },
                lineStyle: { width: 2 },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: alpha(isDark ? '#f8fafc' : '#0f172a', 0.1) }, { offset: 1, color: 'rgba(0,0,0,0)' }]
                    }
                },
                data: campaignStats.map(c => c.forming),
                markLine: showBenchmarks ? {
                    symbol: ['none', 'none'],
                    data: [{ yAxis: avgForming, lineStyle: { color: isDark ? '#f8fafc' : '#0f172a', type: 'dashed', width: 2, opacity: 0.4 }, label: { show: true, position: 'end', formatter: 'Avg F: {c}%', fontSize: 9, fontWeight: 900, color: theme.palette.text.primary } }]
                } : undefined
            },
            {
                name: 'Packing',
                type: 'line',
                smooth: 0.3,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: { color: theme.palette.primary.main, borderWidth: 1, borderColor: theme.palette.background.paper },
                lineStyle: { width: 2 },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: alpha(theme.palette.primary.main, 0.1) }, { offset: 1, color: 'rgba(0,0,0,0)' }]
                    }
                },
                data: campaignStats.map(c => c.packing),
                markLine: showBenchmarks ? {
                    symbol: ['none', 'none'],
                    data: [{ yAxis: avgPacking, lineStyle: { color: theme.palette.primary.main, type: 'dashed', width: 2, opacity: 0.4 }, label: { show: true, position: 'end', formatter: 'Avg P: {c}%', fontSize: 9, fontWeight: 900, color: theme.palette.text.primary } }]
                } : undefined
            }
        ]
    };

    return (
        <Box ref={fullscreenContainerRef} sx={{ bgcolor: 'background.paper', p: document.fullscreenElement ? 4 : 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', pb: 2, mb: 3 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Historial de Rendimiento ({campaignStats.length} Campañas)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box onClick={() => toggleSeries('Forming')} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isDark ? '#f8fafc' : '#0f172a' }} />
                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary' }}>FORMADO</Typography>
                        </Box>
                        <Box onClick={() => toggleSeries('Packing')} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary' }}>EMPAQUE</Typography>
                        </Box>
                        <Box onClick={() => setShowBenchmarks(!showBenchmarks)} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', bgcolor: showBenchmarks ? 'action.selected' : 'transparent', px: 1, py: 0.5, borderRadius: '4px' }}>
                            <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.primary' }}>PROMEDIOS HISTÓRICOS</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, borderLeft: 1, borderColor: 'divider', pl: 2 }}>
                        <IconButton onClick={toggleFullscreen} title="Pantalla Completa"><span className="material-symbols-outlined text-[20px] text-text-secondary">{document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen'}</span></IconButton>
                        <IconButton onClick={restoreChart} title="Restaurar"><span className="material-symbols-outlined text-[20px] text-text-secondary">restart_alt</span></IconButton>
                        <IconButton onClick={downloadChart} title="Descargar Imagen"><span className="material-symbols-outlined text-[20px] text-text-secondary">image</span></IconButton>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ height: document.fullscreenElement ? 'calc(100vh - 120px)' : 540, width: '100%', bgcolor: 'background.paper' }}>
                <ReactECharts ref={chartRef} option={chartOption} style={{ height: '100%', width: '100%' }} />
            </Box>
        </Box>
    );
}

function IconButton({ children, onClick, title }: any) {
    return (
        <Box onClick={onClick} title={title} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5, borderRadius: '4px', '&:hover': { bgcolor: 'action.hover' } }}>
            {children}
        </Box>
    );
}
