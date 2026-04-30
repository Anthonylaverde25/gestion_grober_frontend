import ReactECharts from "echarts-for-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router";

interface MachineEChartsProps {
  machineId: string;
  machineName: string;
  data: any[];
  color: string;
  articleName?: string;
}

export default function MachineECharts({
  machineId,
  machineName,
  data,
  color,
  articleName,
}: MachineEChartsProps) {
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showAverage, setShowAverage] = useState(false);

  const averageValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.percentage, 0);
    return (sum / data.length).toFixed(1);
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
              console.error(
                `Error attempting to enable full-screen mode: ${err.message}`,
              );
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
        link.download = `Analisis-${machineName}.png`;
        link.href = url;
        link.click();
        break;
      case "history":
        navigate(`/production/extraction/${machineId}/history`);
        break;
    }
  };

  const option = {
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
      bottom: "15%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) =>
        new Date(item.measuredAt).toLocaleString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "short",
        }),
      ),
      axisLabel: { color: "#64748b", fontSize: 11, margin: 15 },
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
        name: machineName,
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 3, color: color },
        areaStyle: {
          opacity: 0.15,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: color },
              { offset: 1, color: "rgba(255,255,255,0)" },
            ],
          },
        },
        data: data.map((item) => item.percentage),
        markLine: showAverage
          ? {
              silent: true,
              symbol: ["none", "none"],
              label: { show: false },
              lineStyle: {
                color: "#64748b",
                type: "dashed",
                width: 2,
                opacity: 0.8,
              },
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
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 0.2,
              }}
            >
              Línea
            </Typography>
            <Typography
              sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}
            >
              {machineName}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleAction("history")}
            startIcon={
              <FuseSvgIcon size={14}>heroicons-outline:clock</FuseSvgIcon>
            }
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
          <Box
            sx={{
              width: "1px",
              height: 24,
              backgroundColor: "#cbd5e1",
              mx: 0.5,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 0.2,
              }}
            >
              Artículo
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "#475569" }}
            >
              {articleName || "N/A"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "1px",
              height: 24,
              backgroundColor: "#cbd5e1",
              mx: 0.5,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#64748b",
                textTransform: "uppercase",
                mb: 0.2,
              }}
            >
              Promedio Turno
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 800, color: "#0058c2" }}
            >
              {averageValue}%
            </Typography>
          </Box>
        </Box>

        {/* Herramientas de Análisis */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip
            title={showAverage ? "Ocultar Promedio" : "Mostrar Promedio"}
          >
            <IconButton
              size="small"
              onClick={() => setShowAverage(!showAverage)}
              sx={{
                color: showAverage ? "#0058c2" : "#64748b",
                backgroundColor: showAverage
                  ? "rgba(0, 88, 194, 0.08)"
                  : "transparent",
              }}
            >
              <FuseSvgIcon size={18}>
                heroicons-outline:presentation-chart-line
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: "1px",
              height: 20,
              backgroundColor: "#cbd5e1",
              mx: 1,
              my: "auto",
            }}
          />

          <Tooltip title="Zoom">
            <IconButton
              size="small"
              onClick={() => handleAction("zoom")}
              sx={{ color: "#64748b" }}
            >
              <FuseSvgIcon size={18}>
                heroicons-outline:magnifying-glass-plus
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Resetear">
            <IconButton
              size="small"
              onClick={() => handleAction("restore")}
              sx={{ color: "#64748b" }}
            >
              <FuseSvgIcon size={18}>heroicons-outline:arrow-path</FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Pantalla Completa">
            <IconButton
              size="small"
              onClick={() => handleAction("fullscreen")}
              sx={{ color: "#64748b" }}
            >
              <FuseSvgIcon size={18}>
                heroicons-outline:arrows-pointing-out
              </FuseSvgIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar PNG">
            <IconButton
              size="small"
              onClick={() => handleAction("download")}
              sx={{ color: "#64748b" }}
            >
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
          style={{ height: "480px", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
      </Box>
    </Box>
  );
}
