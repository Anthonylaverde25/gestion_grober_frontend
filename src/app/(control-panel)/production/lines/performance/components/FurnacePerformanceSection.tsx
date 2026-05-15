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

  const headerBg = isDark ? "#0f172a" : "#f1f5f9";

  return (
    <section className="border overflow-hidden shadow-none rounded-none mb-16" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
      <div className="px-6 py-3 border-b flex items-center justify-between border-l-4" style={{ backgroundColor: headerBg, borderColor: theme.palette.divider, borderLeftColor: theme.palette.primary.main }}>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-20" style={{ color: theme.palette.primary.main }}>
            heat_pump
          </span>
          <h2 className="font-bold text-[16px] uppercase tracking-tight" style={{ color: theme.palette.text.primary }}>
            {furnace.name}
          </h2>
          <span
            className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${hasActiveCampaigns
                ? "bg-green-600 text-white border-green-700 shadow-sm"
                : "bg-white text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              }`}
          >
            {hasActiveCampaigns ? "ACTIVO" : "DISPONIBLE"}
          </span>
        </div>
        <div className="flex items-center gap-8 text-data-tabular">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold opacity-60" style={{ color: theme.palette.text.secondary }}>
              Líneas:
            </span>
            <span className="font-black text-[14px]" style={{ color: theme.palette.text.primary }}>
              {furnace.machines?.length || 0}
            </span>
          </div>
          <button className="p-1 rounded transition-colors ml-2" style={{ color: theme.palette.primary.main }}>
            <span className="material-symbols-outlined text-18">more_vert</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {furnace.machines?.map((machine) => (
            <MachinePerformanceCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </section>
  );
}
