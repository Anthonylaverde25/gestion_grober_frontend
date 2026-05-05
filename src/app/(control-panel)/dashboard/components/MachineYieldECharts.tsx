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
      const end = new Date(sorted[i+1].recordedAt).getTime();
      const diffHours = (end - start) / (1000 * 60 * 60);
      
      if (end - start > threshold) {
        areas.push([
          {
            xAxis: start,
            itemStyle: { 
                color: 'rgba(245, 158, 11, 0.08)', // Ámbar Alerta sutil
            },
            label: {
              show: true,
              position: 'insideTop',
              distance: 15, // Vuelve al interior del área
              formatter: `{a|SIN REPORTE}\n{b|${diffHours.toFixed(1)}h}`,
              rich: {
                  a: { color: '#d97706', fontSize: 8, fontWeight: 800, lineHeight: 12 },
                  b: { color: '#92400e', fontSize: 7, fontWeight: 600 }
              },
              backgroundColor: '#fffbeb',
              padding: [4, 8],
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#fcd34d',
              align: 'center'
            }
          },
          { xAxis: end }
        ]);
      }
    }
    return areas;
  }, [data]);

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
          backgroundColor: "#fff",
        });
        const link = document.createElement("a");
        link.download = `Rendimiento-${machineName}.png`;
        link.href = url;
        link.click();
        break;
      case "history":
        // Redirect to a specific history if needed, for now same as extraction or campaign history
        navigate(`/production/campaigns`); 
        break;
    }
  };

  const option = {
    legend: {
      data: ['Formación', 'Empaque'],
      bottom: 45,
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#64748b', fontWeight: 600, fontSize: 11 }
    },
    toolbox: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: "#64748b" } },
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      borderWidth: 0,
      shadowBlur: 10,
      shadowColor: "rgba(0,0,0,0.1)",
      textStyle: { color: "#191c1e", fontSize: 12 },
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "18%",
      top: "10%", // Reducido al volver las etiquetas al interior
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: { 
        color: "#64748b", 
        fontSize: 11, 
        margin: 15,
        formatter: (value: number) => {
          const date = new Date(value);
          return format(date, "HH:mm\ndd MMM", { locale: es });
        }
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: "#e2e8f0", type: "solid" } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { formatter: "{value}%", color: "#64748b", fontSize: 11 },
      splitLine: { show: true, lineStyle: { color: "#e2e8f0", type: "solid" } },
    },
    dataZoom: [
      { type: "inside", start: 0, end: 100 },
      {
        type: "slider",
        bottom: 10,
        height: 24,
        borderColor: "transparent",
        backgroundColor: "#f1f5f9",
        fillerColor: "rgba(15, 23, 42, 0.1)",
        handleIcon:
          "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        showDetail: false,
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
                    { offset: 0, color: `${color}33` }, // Opacidad 20%
                    { offset: 1, color: `${color}00` }  // Opacidad 0%
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
        lineStyle: { width: 3, color: '#94a3b8', type: 'dashed' },
        data: data.map((item) => [new Date(item.recordedAt), item.packingYield]),
        areaStyle: {
            color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: 'rgba(148, 163, 184, 0.15)' },
                    { offset: 1, color: 'rgba(148, 163, 184, 0)' }
                ]
            }
        },
        markLine: showAverage
          ? {
              silent: true,
              symbol: ["none", "none"],
              label: { show: false },
              lineStyle: { color: "#94a3b8", type: "dotted", width: 1.5, opacity: 0.6 },
              data: [{ type: "average" }],
            }
          : undefined,
      },
    ],
  };

  return (
    <Box ref={containerRef} sx={{ mb: 8, backgroundColor: "#fff" }}>
      {/* Cabecera Industrial */}
      <Box
        sx={{
          mb: 2,
          px: 3,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          borderRadius: 0,
          border: "1px solid #e2e8f0",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", mb: 0.2 }}>
              Línea
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              {machineName}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleAction("history")}
            startIcon={<FuseSvgIcon size={14}>heroicons-outline:clock</FuseSvgIcon>}
            sx={{
              backgroundColor: "#fff",
              color: "#0058c2",
              boxShadow: "none",
              border: "1px solid #e2e8f0",
              fontSize: 11,
              fontWeight: 700,
              height: 32,
              px: 2,
              "&:hover": { backgroundColor: "#f1f5f9", boxShadow: "none" },
            }}
          >
            HISTORIAL
          </Button>
          <Box sx={{ width: "1px", height: 24, backgroundColor: "#cbd5e1", mx: 0.5 }} />
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", mb: 0.2 }}>
              Artículo
            </Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>
              {articleName || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ width: "1px", height: 24, backgroundColor: "#cbd5e1", mx: 0.5 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", mb: 0.2 }}>
                Prom. Formación
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: color }}>
                {averageForming}%
                </Typography>
            </Box>
            <Box>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#64748b", textTransform: "uppercase", mb: 0.2 }}>
                Prom. Empaque
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#475569" }}>
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
                color: showAverage ? "#0058c2" : "#64748b",
                backgroundColor: showAverage ? "rgba(0, 88, 194, 0.08)" : "transparent",
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
                color: showGaps ? "#ef4444" : "#64748b",
                backgroundColor: showGaps ? "rgba(239, 68, 68, 0.08)" : "transparent",
              }}
            >
              <FuseSvgIcon size={18}>heroicons-outline:clock</FuseSvgIcon>
            </IconButton>
          </Tooltip>

          <Box sx={{ width: "1px", height: 20, backgroundColor: "#cbd5e1", mx: 1, my: "auto" }} />

          <Tooltip title="Zoom">
            <IconButton size="small" onClick={() => handleAction("zoom")} sx={{ color: "#64748b" }}>
              <FuseSvgIcon size={18}>heroicons-outline:magnifying-glass-plus</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Resetear">
            <IconButton size="small" onClick={() => handleAction("restore")} sx={{ color: "#64748b" }}>
              <FuseSvgIcon size={18}>heroicons-outline:arrow-path</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Pantalla Completa">
            <IconButton size="small" onClick={() => handleAction("fullscreen")} sx={{ color: "#64748b" }}>
              <FuseSvgIcon size={18}>heroicons-outline:arrows-pointing-out</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PNG">
            <IconButton size="small" onClick={() => handleAction("download")} sx={{ color: "#64748b" }}>
              <FuseSvgIcon size={18}>heroicons-outline:camera</FuseSvgIcon>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Área del Gráfico */}
      <Box sx={{ py: 2, px: 2, backgroundColor: "#fff", position: "relative" }}>
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
