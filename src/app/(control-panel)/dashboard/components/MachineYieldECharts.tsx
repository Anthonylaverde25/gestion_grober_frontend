import ReactECharts from "echarts-for-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTheme, alpha } from "@mui/material/styles";

interface MachineYieldEChartsProps {
  machineId: string;
  machineName: string;
  data: any[];
  color: string;
  articleName?: string;
}

export default function MachineYieldECharts({
  machineId,
  machineName,
  data,
  color,
  articleName,
}: MachineYieldEChartsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showAverage, setShowAverage] = useState(false);
  const [showGaps, setShowGaps] = useState(false);

  const averageForming = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.formingYield, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  const averagePacking = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.packingYield, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  const gapAreas = useMemo(() => {
    if (!data || data.length < 2) return [];
    const threshold = 1000 * 60 * 60; // 1 hora
    const areas: any[] = [];

    const sorted = [...data].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

    for (let i = 0; i < sorted.length - 1; i++) {
      const start = new Date(sorted[i].recordedAt).getTime();
      const end = new Date(sorted[i + 1].recordedAt).getTime();
      const diffHours = (end - start) / (1000 * 60 * 60);

      if (end - start > threshold) {
        areas.push([
          {
            xAxis: start,
            itemStyle: {
              color: isDark ? alpha(theme.palette.warning.main, 0.1) : 'rgba(245, 158, 11, 0.08)',
            },
            label: {
              show: true,
              position: 'insideTop',
              distance: 15,
              formatter: `{a|SIN REPORTE}\n{b|${diffHours.toFixed(1)}h}`,
              rich: {
                a: { color: isDark ? theme.palette.warning.light : '#d97706', fontSize: 8, fontWeight: 800, lineHeight: 12 },
                b: { color: isDark ? theme.palette.warning.main : '#92400e', fontSize: 7, fontWeight: 600 }
              },
              backgroundColor: isDark ? theme.palette.background.paper : '#fffbeb',
              padding: [4, 8],
              borderRadius: 4,
              borderWidth: 1,
              borderColor: isDark ? theme.palette.warning.dark : '#fcd34d',
              align: 'center'
            }
          },
          { xAxis: end }
        ]);
      }
    }
    return areas;
  }, [data, isDark, theme]);

  const handleAction = (action: string) => {
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    switch (action) {
      case "zoom":
        echartsInstance.dispatchAction({
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          dataZoomSelectActive: true,
        });
        break;
      case "restore":
        echartsInstance.dispatchAction({ type: "restore" });
        break;
      case "fullscreen":
        if (containerRef.current) {
          if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch((err) => {
              console.error(`Error full-screen: ${err.message}`);
            });
          } else {
            document.exitFullscreen();
          }
        }
        break;
      case "download":
        const url = echartsInstance.getDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: isDark ? "#121212" : "#fff",
        });
        const link = document.createElement("a");
        link.download = `Rendimiento-${machineName}.png`;
        link.href = url;
        link.click();
        break;
      case "history":
        navigate(`/production/campaigns`);
        break;
    }
  };

  const option = {
    backgroundColor: 'transparent',
    legend: {
      data: ['Formación', 'Empaque'],
      bottom: 45,
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: theme.palette.text.secondary, fontWeight: 600, fontSize: 11 }
    },
    toolbox: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: isDark ? theme.palette.background.paper : "#64748b" } },
      backgroundColor: isDark ? theme.palette.background.paper : "rgba(255, 255, 255, 0.98)",
      borderWidth: 0,
      shadowBlur: 10,
      shadowColor: "rgba(0,0,0,0.1)",
      textStyle: { color: theme.palette.text.primary, fontSize: 12 },
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "18%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 11,
        margin: 15,
        formatter: (value: number) => {
          const date = new Date(value);
          return format(date, "HH:mm\ndd MMM", { locale: es });
        }
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: theme.palette.divider, type: "solid" } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { formatter: "{value}%", color: theme.palette.text.secondary, fontSize: 11 },
      splitLine: { show: true, lineStyle: { color: theme.palette.divider, type: "solid" } },
    },
    dataZoom: [
      { type: "inside", start: 0, end: 100 },
      {
        type: "slider",
        bottom: 10,
        height: 24,
        borderColor: "transparent",
        backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : "#f1f5f9",
        fillerColor: isDark ? alpha(theme.palette.primary.main, 0.2) : "rgba(15, 23, 42, 0.1)",
        handleIcon:
          "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        showDetail: false,
        textStyle: { color: theme.palette.text.secondary }
      },
    ],
    series: [
      {
        name: 'Formación',
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 10,
        showSymbol: true,
        lineStyle: { width: 3, color: color },
        data: data.map((item) => [new Date(item.recordedAt), item.formingYield]),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${color}33` },
              { offset: 1, color: `${color}00` }
            ]
          }
        },
        markArea: {
          silent: true,
          data: showGaps ? gapAreas : []
        },
        markLine: showAverage
          ? {
            silent: true,
            symbol: ["none", "none"],
            label: { show: false },
            lineStyle: { color: color, type: "dashed", width: 1.5, opacity: 0.6 },
            data: [{ type: "average" }],
          }
          : undefined,
      },
      {
        name: 'Empaque',
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 10,
        showSymbol: true,
        lineStyle: { width: 3, color: isDark ? alpha(theme.palette.text.primary, 0.4) : '#94a3b8', type: 'dashed' },
        data: data.map((item) => [new Date(item.recordedAt), item.packingYield]),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: isDark ? alpha(theme.palette.text.primary, 0.1) : 'rgba(148, 163, 184, 0.15)' },
              { offset: 1, color: 'rgba(148, 163, 184, 0)' }
            ]
          }
        },
        markLine: showAverage
          ? {
            silent: true,
            symbol: ["none", "none"],
            label: { show: false },
            lineStyle: { color: isDark ? alpha(theme.palette.text.primary, 0.4) : "#94a3b8", type: "dotted", width: 1.5, opacity: 0.6 },
            data: [{ type: "average" }],
          }
          : undefined,
      },
    ],
  };

  return (
    <Box ref={containerRef} sx={{ mb: 8, backgroundColor: "background.paper", border: '1px solid', borderColor: 'divider' }}>
      {/* Cabecera Industrial */}
      <Box
        sx={{
          mb: 0,
          px: 3,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : "#f1f5f9",
          borderRadius: 0,
          borderBottom: "1px solid",
          borderColor: "divider",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 800, color: "text.secondary", textTransform: "uppercase", mb: 0.2 }}>
              Línea
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
              {machineName}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleAction("history")}
            startIcon={<FuseSvgIcon size={14}>heroicons-outline:clock</FuseSvgIcon>}
            sx={{
              backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.1) : "background.paper",
              color: isDark ? "#ffffff" : "primary.main",
              boxShadow: "none",
              border: "1px solid",
              borderColor: isDark ? "primary.main" : "divider",
              fontSize: 11,
              fontWeight: 700,
              height: 32,
              px: 2,
              "&:hover": { 
                backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.05), 
                boxShadow: "none" 
              },
            }}
          >
            HISTORIAL
          </Button>
          <Box sx={{ width: "1px", height: 24, backgroundColor: "divider", mx: 0.5 }} />
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 800, color: "text.secondary", textTransform: "uppercase", mb: 0.2 }}>
              Artículo
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", opacity: 0.8 }}>
              {articleName || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ width: "1px", height: 24, backgroundColor: "divider", mx: 0.5 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: "text.secondary", textTransform: "uppercase", mb: 0.2 }}>
                Prom. Formación
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: color }}>
                {averageForming}%
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 9, fontWeight: 800, color: "text.secondary", textTransform: "uppercase", mb: 0.2 }}>
                Prom. Empaque
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.primary", opacity: 0.7 }}>
                {averagePacking}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Herramientas de Análisis */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title={showAverage ? "Ocultar Promedio" : "Mostrar Promedio"}>
            <IconButton
              size="small"
              onClick={() => setShowAverage(!showAverage)}
              sx={{
                color: showAverage ? "primary.main" : "text.secondary",
                backgroundColor: showAverage ? alpha(theme.palette.primary.main, 0.08) : "transparent",
              }}
            >
              <FuseSvgIcon size={18}>heroicons-outline:presentation-chart-line</FuseSvgIcon>
            </IconButton>
          </Tooltip>

          <Tooltip title={showGaps ? "Ocultar Brechas" : "Analizar Brechas"}>
            <IconButton
              size="small"
              onClick={() => setShowGaps(!showGaps)}
              sx={{
                color: showGaps ? "error.main" : "text.secondary",
                backgroundColor: showGaps ? alpha(theme.palette.error.main, 0.08) : "transparent",
              }}
            >
              <FuseSvgIcon size={18}>heroicons-outline:clock</FuseSvgIcon>
            </IconButton>
          </Tooltip>

          <Box sx={{ width: "1px", height: 20, backgroundColor: "divider", mx: 1, my: "auto" }} />

          <Tooltip title="Zoom">
            <IconButton size="small" onClick={() => handleAction("zoom")} sx={{ color: "text.secondary" }}>
              <FuseSvgIcon size={18}>heroicons-outline:magnifying-glass-plus</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Resetear">
            <IconButton size="small" onClick={() => handleAction("restore")} sx={{ color: "text.secondary" }}>
              <FuseSvgIcon size={18}>heroicons-outline:arrow-path</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Pantalla Completa">
            <IconButton size="small" onClick={() => handleAction("fullscreen")} sx={{ color: "text.secondary" }}>
              <FuseSvgIcon size={18}>heroicons-outline:arrows-pointing-out</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PNG">
            <IconButton size="small" onClick={() => handleAction("download")} sx={{ color: "text.secondary" }}>
              <FuseSvgIcon size={18}>heroicons-outline:camera</FuseSvgIcon>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Área del Gráfico */}
      <Box sx={{ py: 2, px: 2, backgroundColor: "background.paper", position: "relative" }}>
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: "600px", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </Box>
    </Box>
  );
}
