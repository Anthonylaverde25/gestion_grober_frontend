import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme, alpha } from '@mui/material/styles';

interface ActiveYieldComparisonChartProps {
  yieldSeries: Array<{
    machine_id: string;
    machine_name: string;
    data: Array<{
      value: number;
      time: string;
      timestamp: string;
    }>;
  }>;
  machines?: Array<{
    id: string;
    name: string;
    status: string;
    current_article_name: string;
    current_client_name: string;
    current_campaign_id: string;
    latest_yield: any;
  }>;
}

const MACHINE_COLORS = ['#0058c2', '#ca4e00', '#16a34a', '#ba1a1a', '#7b2600', '#505f76'];

export default function ActiveYieldComparisonChart({ yieldSeries = [], machines = [] }: ActiveYieldComparisonChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedMachine, setSelectedMachine] = useState('all');

  const filteredSeries = useMemo(() => {
    if (selectedMachine === 'all') return yieldSeries;
    return yieldSeries.filter(s => s.machine_id === selectedMachine);
  }, [yieldSeries, selectedMachine]);

  const option = useMemo(() => {
    const timeLabels = yieldSeries.length > 0
      ? yieldSeries[0].data.map(d => d.time)
      : [];

    return {
      backgroundColor: 'transparent',
      animation: true,
      grid: {
        left: '2%',
        right: '2%',
        bottom: '15%', // Increased for dataZoom
        top: '12%',
        containLabel: true
      },
      legend: {
        show: selectedMachine === 'all',
        top: 0,
        right: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: theme.palette.text.secondary,
          fontSize: 10,
          fontWeight: 700
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          bottom: 10,
          height: 20,
          borderColor: 'transparent',
          backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f1f5f9',
          fillerColor: isDark ? alpha(theme.palette.primary.main, 0.15) : 'rgba(15, 23, 42, 0.08)',
          handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          showDetail: false
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
        axisLine: { show: false },
        axisLabel: {
          color: theme.palette.text.disabled,
          fontSize: 10,
          fontWeight: 600,
          margin: 15
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark ? alpha(theme.palette.divider, 0.2) : '#f1f5f9',
            type: 'solid'
          }
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
          color: theme.palette.text.disabled,
          fontSize: 10,
          fontWeight: 600
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark ? alpha(theme.palette.divider, 0.3) : '#f1f5f9',
            type: 'solid'
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1a1c1e' : '#ffffff',
        borderColor: theme.palette.divider,
        borderWidth: 1,
        textStyle: { color: theme.palette.text.primary },
        padding: [12, 18],
        borderRadius: 4,
        formatter: (params: any) => {
          let result = `<div style="font-weight: 800; margin-bottom: 10px; border-bottom: 1px solid ${theme.palette.divider}; padding-bottom: 6px; font-size: 12px; color: ${theme.palette.primary.main}">REGISTRO: ${params[0].name}</div>`;
          params.forEach((item: any) => {
            const seriesIndex = yieldSeries.findIndex(s => s.machine_name === item.seriesName);
            const color = MACHINE_COLORS[seriesIndex % MACHINE_COLORS.length];
            result += `
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}"></div>
                <div style="flex: 1; font-size: 12px; color: ${theme.palette.text.secondary}">${item.seriesName}</div>
                <div style="font-weight: 800; font-size: 13px;">${item.value.toFixed(1)}%</div>
              </div>
            `;
          });
          return result;
        }
      },
      series: filteredSeries.map((series) => {
        const globalIndex = yieldSeries.findIndex(s => s.machine_id === series.machine_id);
        const color = MACHINE_COLORS[globalIndex % MACHINE_COLORS.length];

        return {
          name: series.machine_name,
          type: 'line',
          stack: 'Total', // STACKED AREA
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: color
          },
          itemStyle: { color: color },
          areaStyle: {
            opacity: 0.8,
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: color },
                { offset: 1, color: alpha(color, 0.3) }
              ]
            }
          },
          emphasis: {
            focus: 'series'
          },
          data: series.data.map(d => d.value)
        };
      })
    };
  }, [yieldSeries, filteredSeries, selectedMachine, isDark, theme]);

  const hasData = yieldSeries && yieldSeries.length > 0;

  return (
    <Box sx={{ width: '100%', height: 650, display: 'flex', flexDirection: 'column', mb: 4 }}>
      {/* Header Simplificado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
        <Typography sx={{
          fontSize: 14,
          fontWeight: 700,
          color: 'text.primary',
          letterSpacing: '-0.01em',
          textTransform: 'none'
        }}>
          Rendimiento Comparativo por Línea (%)
        </Typography>
      </Box>

      {/* Main Content: Chart + Integrated Spreadsheet */}
      <Box sx={{ flex: 1, display: 'flex', gap: 0, minHeight: 0, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {/* Left: Chart Area */}
        <Box sx={{ flex: 1, position: 'relative', minWidth: 0, bgcolor: isDark ? alpha(theme.palette.background.paper, 0.2) : '#fcfdfe', p: 2 }}>
          {!hasData ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'text.disabled', fontWeight: 600 }}>SIN DATOS</Typography>
            </Box>
          ) : (
            <ReactECharts
              option={{
                ...option,
                series: filteredSeries.map((series) => {
                  const globalIndex = yieldSeries.findIndex(s => s.machine_id === series.machine_id);
                  const color = MACHINE_COLORS[globalIndex % MACHINE_COLORS.length];

                  return {
                    name: series.machine_name,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: selectedMachine !== 'all',
                    lineStyle: {
                      width: 3,
                      color: color
                    },
                    itemStyle: { color: color },
                    areaStyle: {
                      opacity: 0.2,
                      color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                          { offset: 0, color: `${color}33` },
                          { offset: 1, color: `${color}00` }
                        ]
                      }
                    },
                    emphasis: {
                      focus: 'series',
                      lineStyle: { width: 4 }
                    },
                    data: series.data.map(d => d.value)
                  };
                })
              }}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
            />
          )}
        </Box>

        {/* Right: Integrated Spreadsheet (List) */}
        <Box sx={{
          width: 550,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderLeft: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Table Header */}
          <Box sx={{ display: 'flex', bgcolor: isDark ? alpha(theme.palette.background.default, 0.6) : '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ width: 40, py: 1.5, display: 'flex', justifyContent: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.disabled' }}>#</Typography>
            </Box>
            <Box sx={{ flex: 1.2, px: 2, py: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary' }}>MÁQUINA</Typography>
            </Box>
            <Box sx={{ flex: 1.5, px: 2, py: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary' }}>ARTÍCULO</Typography>
            </Box>
            <Box sx={{ width: 80, py: 1.5, display: 'flex', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.secondary' }}>REND.</Typography>
            </Box>
          </Box>

          {/* Table Body */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {machines.map((machine, index) => {
              const globalIndex = yieldSeries.findIndex(s => s.machine_id === machine.id);
              const color = globalIndex >= 0 ? MACHINE_COLORS[globalIndex % MACHINE_COLORS.length] : theme.palette.text.disabled;
              const isSelected = selectedMachine === 'all' || selectedMachine === machine.id;

              return (
                <Box
                  key={machine.id}
                  onClick={() => setSelectedMachine(machine.id)}
                  sx={{
                    display: 'flex',
                    borderBottom: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.5),
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    opacity: isSelected ? 1 : 0.4,
                    bgcolor: selectedMachine === machine.id ? alpha(color, 0.05) : 'transparent',
                    '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5), opacity: 1 }
                  }}
                >
                  <Box sx={{ width: 40, py: 2, display: 'flex', justifyContent: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3), bgcolor: isDark ? alpha(theme.palette.background.default, 0.2) : '#fcfdfe' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.disabled', fontFamily: 'monospace' }}>{index + 1}</Typography>
                  </Box>
                  <Box sx={{ flex: 1.2, px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3) }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: isSelected ? color : 'text.primary' }}>{machine.name}</Typography>
                  </Box>
                  <Box sx={{ flex: 1.5, px: 2, py: 2, display: 'flex', alignItems: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3) }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {machine.current_article_name || '---'}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 80, py: 2, display: 'flex', justifyContent: 'center', bgcolor: isDark ? alpha(theme.palette.background.default, 0.1) : '#fcfcfc' }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: color, fontFamily: 'monospace' }}>
                      {machine.latest_yield ? `${machine.latest_yield.percentage.toFixed(1)}%` : '0%'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Plant Average Footer */}
          <Box sx={{ p: 2, bgcolor: isDark ? alpha(theme.palette.background.default, 0.8) : '#f8fafc', borderTop: '2px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.disabled' }}>PROMEDIO PLANTA</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                {(yieldSeries.reduce((acc, s) => acc + (s.data[s.data.length - 1]?.value || 0), 0) / yieldSeries.length).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
