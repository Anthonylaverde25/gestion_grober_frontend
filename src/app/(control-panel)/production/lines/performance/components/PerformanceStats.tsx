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
    <div className="flex flex-col gap-6">
      {/* Active Campaigns Card */}
      <div className="border p-8 flex flex-col gap-2 shadow-none rounded-none" style={cardStyle}>
        <span className="font-label-caps text-[11px] uppercase opacity-70" style={labelStyle}>
          Máquinas en Campaña
        </span>
        <div className="flex items-end gap-2">
          <span className="font-headline-md text-24 font-black">
            {activeCampaigns} / {totalMachines}
          </span>
          <span className="font-label-caps text-[10px] mb-1 font-bold" style={labelStyle}>
            Activas
          </span>
        </div>
        <div className="w-full h-2 mt-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div
            className="h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{
              width: `${totalMachines > 0 ? (activeCampaigns / totalMachines) * 100 : 0}%`,
              backgroundColor: theme.palette.primary.main
            }}
          ></div>
        </div>
      </div>

      {/* Global Yield (Average Forma) Card */}
      <div className="border p-8 flex flex-col gap-2 shadow-none rounded-none" style={cardStyle}>
        <span className="font-label-caps text-[11px] uppercase opacity-70" style={labelStyle}>
          Eficiencia Forma (Avg)
        </span>
        <div className="flex items-end gap-2">
          <span className="font-headline-md text-24 font-black">--.-%</span>
          <span className="font-label-caps text-[10px] mb-1 font-bold" style={labelStyle}>
            Target 95%
          </span>
        </div>
        <div className="text-[11px] font-medium flex items-center gap-2 mt-2" style={labelStyle}>
          <span className="material-symbols-outlined text-[16px] text-amber-500">warning</span>
          Datos en sincronización...
        </div>
      </div>

      {/* Packing Yield Card */}
      <div className="border p-8 flex flex-col gap-2 shadow-none rounded-none" style={cardStyle}>
        <span className="font-label-caps text-[11px] uppercase opacity-70" style={labelStyle}>
          Eficiencia Empaque (Avg)
        </span>
        <div className="flex items-end gap-2">
          <span className="font-headline-md text-24 font-black">--.-%</span>
          <span className="font-label-caps text-[10px] mb-1 font-bold" style={labelStyle}>
            Target 98%
          </span>
        </div>
        <div className="text-[11px] font-medium flex items-center gap-2 mt-2" style={labelStyle}>
          <span className="material-symbols-outlined text-[16px] text-blue-500">info</span>
          Monitoreo activo
        </div>
      </div>
    </div>
  );
}
