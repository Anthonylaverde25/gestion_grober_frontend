import { Furnace } from "@/app/core/domain/entities/Furnace";
import MachinePerformanceCard from "./MachinePerformanceCard";
import Typography from "@mui/material/Typography";

interface FurnacePerformanceSectionProps {
  furnace: Furnace;
}

export default function FurnacePerformanceSection({ furnace }: FurnacePerformanceSectionProps) {
  const isOperational = furnace.status === "operational";
  const hasActiveCampaigns = furnace.machines?.some(m => !!m.currentCampaignId);

  return (
    <section className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-none rounded-none mb-8">
      <div className="px-gutter py-stack-md border-b border-outline-variant flex items-center justify-between bg-[#e2e8f0]">
        <div className="flex items-center gap-stack-sm">
          <span className="material-symbols-outlined text-primary">
            heat_pump
          </span>
          <h2 className="font-headline-md text-[18px] text-on-surface">
            {furnace.name}
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
              hasActiveCampaigns
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            {hasActiveCampaigns ? "PRODUCCIÓN ACTIVA" : "DISPONIBLE"}
          </span>
        </div>
        <div className="flex items-center gap-gutter text-data-tabular">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-on-surface-variant uppercase">
              Líneas de Producción
            </span>
            <span className="text-on-surface font-bold">
              {furnace.machines?.length || 0}
            </span>
          </div>
          <button className="text-primary hover:bg-primary/5 p-1 rounded transition-colors ml-2">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div className="p-gutter bg-surface-container-lowest">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {furnace.machines?.map((machine) => (
            <MachinePerformanceCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </section>
  );
}
