import { Furnace } from "@/app/core/domain/entities/Furnace";
import MachinePerformanceCard from "./MachinePerformanceCard";
import { useTheme, alpha } from "@mui/material/styles";

interface FurnacePerformanceSectionProps {
  furnace: Furnace;
}

export default function FurnacePerformanceSection({ furnace }: FurnacePerformanceSectionProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasActiveCampaigns = furnace.machines?.some(m => !!m.currentCampaignId);

  const headerBg = isDark ? alpha(theme.palette.primary.main, 0.1) : "#e2e8f0";

  return (
    <section className="border overflow-hidden shadow-none rounded-none mb-8" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
      <div className="px-gutter py-stack-md border-b flex items-center justify-between" style={{ backgroundColor: headerBg, borderColor: theme.palette.divider }}>
        <div className="flex items-center gap-stack-sm">
          <span className="material-symbols-outlined" style={{ color: theme.palette.primary.main }}>
            heat_pump
          </span>
          <h2 className="font-headline-md text-[18px]" style={{ color: theme.palette.text.primary }}>
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
            <span className="text-[10px] uppercase" style={{ color: theme.palette.text.secondary }}>
              Líneas de Producción
            </span>
            <span className="font-bold" style={{ color: theme.palette.text.primary }}>
              {furnace.machines?.length || 0}
            </span>
          </div>
          <button className="p-1 rounded transition-colors ml-2" style={{ color: theme.palette.primary.main }}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div className="p-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {furnace.machines?.map((machine) => (
            <MachinePerformanceCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </section>
  );
}
