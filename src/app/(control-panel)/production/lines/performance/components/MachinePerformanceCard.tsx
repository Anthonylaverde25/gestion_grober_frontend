import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";
import { Machine } from "@/app/core/domain/entities/Machine";
import StartCampaignModal from "./StartCampaignModal";
import RegisterLineYieldModal from "./RegisterLineYieldModal";
import RegisterPackingSheetModal from "./RegisterPackingSheetModal";
import { useTheme, alpha } from "@mui/material/styles";

interface MachinePerformanceCardProps {
  machine: Machine;
}

export default function MachinePerformanceCard({ machine }: MachinePerformanceCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isOperational = machine.status === "operational";
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);

  const hasCampaign = !!machine.currentCampaignId;

  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary,
    opacity: !isOperational && !hasCampaign ? 0.75 : 1,
  };

  const secondaryTextStyle = {
    color: theme.palette.text.secondary
  };

  const subContainerStyle = {
    backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8fafc',
    borderColor: theme.palette.divider
  };

  return (
    <>
      <div
        className="border p-stack-md flex flex-col gap-stack-md transition-all shadow-none rounded-none hover:border-primary"
        style={cardStyle}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-data-tabular text-body-main font-semibold">
              {machine.name}
            </h3>
            <p className="text-[12px]" style={secondaryTextStyle}>
              ID: {machine.id.split("-")[0]}
            </p>
          </div>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${
              hasCampaign
                ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                : "bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            {hasCampaign ? "En Campaña" : "Disponible"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[13px] border p-1 rounded-none" style={subContainerStyle}>
            <span style={secondaryTextStyle}>Cliente</span>
            <span className="font-data-tabular font-bold truncate max-w-[150px]">
              {hasCampaign ? machine.currentClientName : "--"}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span style={secondaryTextStyle}>Artículo Actual</span>
            <span className="font-data-tabular text-[11px] font-bold truncate max-w-[150px]">
              {hasCampaign ? machine.currentArticleName : "--"}
            </span>
          </div>
          
          {hasCampaign && (
            <div className="w-full h-1.5 rounded-full overflow-hidden mt-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
              <div
                className="h-full transition-all duration-1000"
                style={{ width: "65%", backgroundColor: theme.palette.primary.main }} 
              ></div>
            </div>
          )}
          
          <div className="flex justify-between text-[11px]">
            <span className="italic" style={secondaryTextStyle}>
              Estado: {hasCampaign ? "En Producción" : "Standby"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {hasCampaign ? (
            <>
              <button
                onClick={() => setIsYieldModalOpen(true)}
                className="flex-1 h-10 font-label-caps text-label-caps rounded-none active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}
              >
                <span className="material-symbols-outlined text-[18px]">add_notes</span>
                Log Yield
              </button>

              <Tooltip title="Vista de Tabla">
                <button
                  onClick={() => setIsPackingModalOpen(true)}
                  className="w-10 h-10 border rounded-none transition-colors flex items-center justify-center"
                  style={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
                >
                  <span className="material-symbols-outlined text-[18px]">grid_on</span>
                </button>
              </Tooltip>

              <Tooltip title="Historial de Rendimiento">
                <button
                  onClick={() => navigate(`/production/lines-performance/${machine.currentCampaignId}/history`)}
                  className="w-10 h-10 border rounded-none transition-colors flex items-center justify-center"
                  style={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </button>
              </Tooltip>
            </>
          ) : (
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="flex-1 h-10 font-label-caps text-label-caps rounded-none border active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ borderColor: theme.palette.divider, color: theme.palette.text.secondary }}
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Iniciar Campaña
            </button>
          )}
        </div>
      </div>

      <StartCampaignModal open={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} machine={machine} />
      <RegisterLineYieldModal open={isYieldModalOpen} onClose={() => setIsYieldModalOpen(false)} machine={machine} />
      <RegisterPackingSheetModal open={isPackingModalOpen} onClose={() => setIsPackingModalOpen(false)} machine={machine} />
    </>
  );
}
