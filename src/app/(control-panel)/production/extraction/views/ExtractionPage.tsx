import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import PageHeader from "@/app/components/PageHeader";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useExtractionDashboard } from "@/app/features/extraction/hooks/useExtractionDashboard";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// Sub-components
import ExtractionStats from "../components/ExtractionStats";
import FurnaceSection from "../components/FurnaceSection";

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
 * ExtractionPage Component
 * Organized production view using modular components.
 */
export default function ExtractionPage() {
  const { furnaces, isLoading, error } = useExtractionDashboard();

  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center h-full gap-4">
        <CircularProgress />
        <Typography
          variant="body2"
          className="text-on-surface-variant font-medium animate-pulse"
        >
          Cargando configuración de producción...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <span className="material-symbols-outlined text-error text-4xl">
          error
        </span>
        <Typography variant="h6" className="text-error font-bold">
          Error al cargar los datos
        </Typography>
        <Typography variant="body2" className="text-on-surface-variant max-w-md">
          No se pudo establecer conexión con el servidor para obtener la
          información de los hornos. Por favor, verifica tu conexión o intenta
          nuevamente más tarde.
        </Typography>
      </Box>
    );
  }

  return (
    <Root
      header={
        <PageHeader
          title="Furnace Overview"
          subtitle="Monitoreo de extracción y eficiencia operativa en tiempo real"
        />
      }
      content={
        <div className="pb-16 px-margin-edge max-w-[1600px] mx-auto w-full pt-8 text-on-surface">
          {/* Summary Dashboard Header */}
          <ExtractionStats furnaces={furnaces} />

          {/* List of Furnaces and Machines */}
          <div className="space-y-stack-lg">
            {furnaces.map((furnace) => (
              <FurnaceSection key={furnace.id} furnace={furnace} />
            ))}

            {furnaces.length === 0 && !isLoading && (
              <Box className="bg-surface-container-lowest border border-dashed border-outline-variant p-12 text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-2">
                  inventory_2
                </span>
                <Typography variant="h6" className="text-on-surface-variant">
                  No se encontraron hornos configurados
                </Typography>
                <Typography
                  variant="body2"
                  className="text-on-surface-variant mb-4"
                >
                  Para comenzar a monitorear la producción, primero debes
                  configurar tus hornos y máquinas.
                </Typography>
                <Link
                  to="/settings/production"
                  className="text-primary font-bold hover:underline"
                >
                  Configurar Producción
                </Link>
              </Box>
            )}
          </div>

          {/* FAB for Global Reports */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center transition-all z-99"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add
            </span>
          </motion.button>
        </div>
      }
    />
  );
}
