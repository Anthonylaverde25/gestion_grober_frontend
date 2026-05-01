import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router";
import { Machine } from "@/app/core/domain/entities/Machine";
import StartCampaignModal from "./StartCampaignModal";
import RegisterLineYieldModal from "./RegisterLineYieldModal";
import RegisterPackingSheetModal from "./RegisterPackingSheetModal";

interface MachinePerformanceCardProps {
  machine: Machine;
}

export default function MachinePerformanceCard({ machine }: MachinePerformanceCardProps) {
  const navigate = useNavigate();
  const isOperational = machine.status === "operational";
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);

  const hasCampaign = !!machine.currentCampaignId;

  return (
    <>
      <div
        className={`bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant p-stack-md flex flex-col gap-stack-md hover:border-primary transition-all shadow-none rounded-none ${
          !isOperational && !hasCampaign ? "opacity-75" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-data-tabular text-body-main font-semibold text-on-surface">
              {machine.name}
            </h3>
            <p className="text-[12px] text-on-surface-variant">
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
          <div className="flex justify-between text-[13px] border bg-surface-container-low dark:bg-surface-container-low p-1 rounded-none">
            <span className="text-on-surface-variant">Cliente</span>
            <span className="font-data-tabular font-bold text-on-surface truncate max-w-[150px]">
              {hasCampaign ? machine.currentClientName : "--"}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-on-surface-variant">Artículo Actual</span>
            <span className="font-data-tabular text-on-surface text-[11px] font-bold truncate max-w-[150px]">
              {hasCampaign ? machine.currentArticleName : "--"}
            </span>
          </div>
          
          {hasCampaign && (
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: "65%" }} // Placeholder for real progress if available
              ></div>
            </div>
          )}
          
          <div className="flex justify-between text-[11px]">
            <span className="text-on-surface-variant italic">
              Estado: {hasCampaign ? "En Producción" : "Standby"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {hasCampaign ? (
            <>
              <button
                onClick={() => setIsYieldModalOpen(true)}
                className="flex-1 h-10 font-label-caps text-label-caps rounded-none bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_notes</span>
                Log Yield
              </button>

              <Tooltip title="Vista de Tabla">
                <button
                  onClick={() => setIsPackingModalOpen(true)}
                  className="w-10 h-10 border border-outline-variant dark:border-outline-variant rounded-none hover:bg-surface-variant transition-colors flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_on</span>
                </button>
              </Tooltip>

              <Tooltip title="Historial de Rendimiento">
                <button
                  onClick={() => navigate(`/production/lines-performance/${machine.currentCampaignId}/history`)}
                  className="w-10 h-10 border border-outline-variant dark:border-outline-variant rounded-none hover:bg-surface-variant transition-colors flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </button>
              </Tooltip>
            </>
          ) : (
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="flex-1 h-10 font-label-caps text-label-caps rounded-none border border-outline text-on-surface-variant hover:bg-surface dark:hover:bg-surface-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
