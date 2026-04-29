import { Furnace } from "@/app/core/domain/entities/Furnace";

interface ExtractionStatsProps {
  furnaces: Furnace[];
}

export default function ExtractionStats({ furnaces }: ExtractionStatsProps) {
  const totalUnits = furnaces.reduce(
    (acc, f) => acc + (f.machines?.length || 0),
    0
  );
  const activeUnits = furnaces.reduce(
    (acc, f) =>
      acc + (f.machines?.filter((m) => m.status === "operational").length || 0),
    0
  );

  return (
    <header className="mb-stack-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Total Extraction Card */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Total Extraction
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">--.-</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Tons / Day
            </span>
          </div>
          <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>{" "}
            Real-time data pending
          </div>
        </div>

        {/* Active Units Card */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Active Units
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">
              {activeUnits} / {totalUnits}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Online
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-1000"
              style={{
                width: `${totalUnits > 0 ? (activeUnits / totalUnits) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Operational Efficiency Card */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 shadow-none rounded-none">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Operational Efficiency
          </span>
          <div className="flex items-end gap-2">
            <span className="font-headline-md text-headline-md text-on-surface">--.-%</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Target 95%
            </span>
          </div>
          <div className="text-[12px] text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">analytics</span>{" "}
            Performance monitoring active
          </div>
        </div>
      </div>
    </header>
  );
}
