import { Furnace } from "@/app/core/domain/entities/Furnace";
import { useTheme } from "@mui/material/styles";

interface PerformanceStatsProps {
  furnaces: Furnace[];
}

export default function PerformanceStats({ furnaces }: PerformanceStatsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  let totalMachines = 0;
  let activeCampaigns = 0;

  furnaces.forEach(f => {
    f.machines?.forEach(m => {
      totalMachines++;
      if (m.currentCampaignId) activeCampaigns++;
    });
  });

  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary
  };

  const labelStyle = {
    color: theme.palette.text.secondary
  };

  return (
    <header className="mb-stack-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Active Campaigns Card */}
        <div className="border p-stack-md flex flex-col gap-1 shadow-none rounded-none" style={cardStyle}>
          <span className="font-label-caps text-label-caps uppercase" style={labelStyle}>
            Máquinas en Campaña
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md">
              {activeCampaigns} / {totalMachines}
            </span>
            <span className="font-label-caps text-label-caps mb-1" style={labelStyle}>
              Activas
            </span>
          </div>
          <div className="w-full h-1.5 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${totalMachines > 0 ? (activeCampaigns / totalMachines) * 100 : 0}%`,
                backgroundColor: theme.palette.primary.main
              }}
            ></div>
          </div>
        </div>

        {/* Global Yield (Average Forma) Card */}
        <div className="border p-stack-md flex flex-col gap-1 shadow-none rounded-none" style={cardStyle}>
          <span className="font-label-caps text-label-caps uppercase" style={labelStyle}>
            Promedio Eficiencia Forma
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md">--.-%</span>
            <span className="font-label-caps text-label-caps mb-1" style={labelStyle}>
              Target 95%
            </span>
          </div>
          <div className="text-[12px] font-medium flex items-center gap-1" style={labelStyle}>
            <span className="material-symbols-outlined text-sm">trending_up</span>{" "}
            Cálculo en tiempo real pendiente
          </div>
        </div>

        {/* Packing Yield Card */}
        <div className="border p-stack-md flex flex-col gap-1 shadow-none rounded-none" style={cardStyle}>
          <span className="font-label-caps text-label-caps uppercase" style={labelStyle}>
            Promedio Eficiencia Empaque
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md">--.-%</span>
            <span className="font-label-caps text-label-caps mb-1" style={labelStyle}>
              Target 98%
            </span>
          </div>
          <div className="text-[12px] font-medium flex items-center gap-1" style={labelStyle}>
            <span className="material-symbols-outlined text-sm">analytics</span>{" "}
            Monitoreo de rendimiento activo
          </div>
        </div>
      </div>
    </header>
  );
}
