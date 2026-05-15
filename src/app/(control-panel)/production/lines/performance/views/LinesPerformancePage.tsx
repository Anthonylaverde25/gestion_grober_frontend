import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import PageHeader from "@/app/components/PageHeader";
import { Link } from "react-router";
import { useExtractionDashboard } from "@/app/features/extraction/hooks/useExtractionDashboard";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";
import PerformanceStats from "../components/PerformanceStats";
import FurnacePerformanceSection from "../components/FurnacePerformanceSection";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import WatermarkView from '@/app/components/ui/WatermarkView';

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    padding: 0,
    backgroundColor: theme.palette.background.default,
  },
}));

/**
 * LinesPerformancePage Component
 * Standardized with corporate PageHeader format from Articles.
 * Optimized for Dark Mode.
 */
export default function LinesPerformancePage() {
  const { furnaces, isLoading, error } = useExtractionDashboard();
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const totalActiveCampaigns = useMemo(() => {
    return furnaces.reduce((acc, f) => acc + (f.machines?.filter((m: any) => m.currentCampaignId).length || 0), 0);
  }, [furnaces]);

  const filteredFurnaces = useMemo(() => {
    if (!showOnlyActive) return furnaces;
    return furnaces.map(furnace => ({
      ...furnace,
      machines: furnace.machines.filter((m: any) => m.currentCampaignId)
    })).filter(furnace => furnace.machines.length > 0);
  }, [furnaces, showOnlyActive]);

  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center h-full gap-4">
        <CircularProgress />
        <Typography variant="body2" className="font-medium animate-pulse" sx={{ color: 'text.secondary' }}>
          Cargando configuración de producción...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <span className="material-symbols-outlined text-error text-4xl">error</span>
        <Typography variant="h6" className="font-bold" sx={{ color: 'error.main' }}>Error al cargar los datos</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} className="max-w-md">
          No se pudo establecer conexión con el servidor para obtener la
          información de rendimiento.
        </Typography>
      </Box>
    );
  }

  return (
    <Root
      header={
        <PageHeader
          title={<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Rendimiento de Líneas</Typography>}
          subtitle="Gestión de campanas y registro de mermas (Line Yield)"
          actions={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {totalActiveCampaigns === 0 && !isLoading && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => navigate(furnaces.length === 0 ? '/settings/production' : '/campaigns')}
                  startIcon={<span className="material-symbols-outlined">play_arrow</span>}
                  sx={{ borderRadius: '8px', fontWeight: 800, textTransform: 'none' }}
                >
                  {furnaces.length === 0 ? "Configurar" : "Iniciar Campaña"}
                </Button>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyActive}
                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Solo Activas
                  </Typography>
                }
              />
            </Box>
          }
        />
      }
      content={
        <>
          <div className="pb-32 mt-4 px-margin-edge max-w-[1600px] mx-auto w-full pt-8" style={{ color: theme.palette.text.primary }}>
            {totalActiveCampaigns === 0 && !isLoading ? (
              <WatermarkView />
            ) : (
              <>
                <PerformanceStats furnaces={filteredFurnaces} />

                <div className="space-y-stack-lg">
                  {filteredFurnaces.map((furnace) => (
                    <FurnacePerformanceSection key={furnace.id} furnace={furnace} />
                  ))}

                  {filteredFurnaces.length === 0 && showOnlyActive && (
                    <WatermarkView />
                  )}
                </div>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-99"
            style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add
            </span>
          </motion.button>
        </>
      }
    />
  );
}
