import { Furnace } from "@/app/core/domain/entities/Furnace";
import MachineCard from "./MachineCard";

interface FurnaceSectionProps {
  furnace: Furnace;
}

export default function FurnaceSection({ furnace }: FurnaceSectionProps) {
  const isOperational = furnace.status === "operational";

  return (
    <section className="bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant dark:border-outline-variant overflow-hidden shadow-none rounded-none">
      <div className="px-gutter py-stack-md border-b border-outline-variant dark:border-outline-variant flex items-center justify-between bg-surface-container-low dark:bg-surface-container-low">
        <div className="flex items-center gap-stack-sm">
          <span className="material-symbols-outlined text-primary">
            heat_pump
          </span>
          <h2 className="font-headline-md text-[18px] text-on-surface">
            {furnace.name}
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
              isOperational
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            {isOperational ? "OPTIMAL" : furnace.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-gutter text-data-tabular">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-on-surface-variant uppercase">
              Max Capacity
            </span>
            <span className="text-on-surface font-bold">
              {furnace.maxCapacityTons} t
            </span>
          </div>
          <button className="text-primary hover:bg-primary/5 p-1 rounded transition-colors ml-2">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>
      <div className="p-gutter bg-surface-container-lowest dark:bg-surface-container-lowest">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {furnace.machines?.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>
    </section>
  );
}
