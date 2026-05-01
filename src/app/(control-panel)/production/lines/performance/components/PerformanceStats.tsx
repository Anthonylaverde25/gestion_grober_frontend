import { Furnace } from "@/app/core/domain/entities/Furnace";

interface PerformanceStatsProps {
  furnaces: Furnace[];
}

export default function PerformanceStats({ furnaces }: PerformanceStatsProps) {
  let totalMachines = 0;
  let activeCampaigns = 0;

  furnaces.forEach(f => {
    f.machines?.forEach(m => {
      totalMachines++;
      if (m.currentCampaignId) activeCampaigns++;
    });
  });

  return (
    <header className="mb-stack-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Active Campaigns Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Máquinas en Campaña
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">
              {activeCampaigns} / {totalMachines}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Activas
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-1000"
              style={{
                width: `${totalMachines > 0 ? (activeCampaigns / totalMachines) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Global Yield (Average Forma) Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Promedio Eficiencia Forma
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">--.-%</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Target 95%
            </span>
          </div>
          <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>{" "}
            Cálculo en tiempo real pendiente
          </div>
        </div>

        {/* Packing Yield Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Promedio Eficiencia Empaque
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">--.-%</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Target 98%
            </span>
          </div>
          <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">analytics</span>{" "}
            Monitoreo de rendimiento activo
          </div>
        </div>
      </div>
    </header>
  );
}
