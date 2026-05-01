import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { LineYield } from "@/app/core/domain/entities/LineYield";
import Box from "@mui/material/Box";

interface YieldCampaignHeaderProps {
  campaign?: Campaign | null;
  latestYield?: LineYield | null;
}

export default function YieldCampaignHeader({ campaign, latestYield }: YieldCampaignHeaderProps) {
  console.log("campaign desde el header no page", campaign);
  console.log("latestYield", latestYield);
  return (
    <section className="bg-[#e2e8f0] border-b border-outline-variant px-margin-edge py-gutter shadow-none rounded-none">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center gap-gutter">
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
            <Typography variant="h5" className="font-black text-[#0f172a] uppercase tracking-tight">
              {campaign?.machineName || "Línea de Producción"}
            </Typography>
            <span className="px-2 py-0.5 self-center md:self-auto rounded-full text-[10px] font-bold border border-green-200 bg-green-100 text-green-800 uppercase tracking-wider">
              Campaña Activa
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-1 text-[#475569] text-[13px] font-bold uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">business</span>
              <span>Cliente: <span className="text-on-surface">{campaign?.client?.name || "N/A"}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              <span>Artículo: <span className="text-on-surface">{campaign?.article?.name || "N/A"}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">event</span>
              <span>Inicio: <span className="text-on-surface font-data-tabular">
                {campaign?.startedAt ? format(new Date(campaign.startedAt), "dd/MM/yyyy HH:mm") : "N/A"}
              </span></span>
            </div>
          </div>
        </div>

        <div className="flex gap-gutter border-l border-white/40 pl-gutter hidden md:flex">
          <div className="flex flex-col items-end text-right">
            <Typography variant="caption" className="uppercase font-black text-[#475569] tracking-widest text-[9px]">
              Último Forming
            </Typography>
            <div className="flex items-baseline gap-1">
              <Typography variant="h4" className="font-data-tabular font-bold text-[#0f172a]">
                {latestYield?.formingYield ? latestYield.formingYield.toFixed(2) : "0.00"}
              </Typography>
              <Typography variant="caption" className="font-bold text-[#475569]">%</Typography>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <Typography variant="caption" className="uppercase font-black text-[#475569] tracking-widest text-[9px]">
              Último Packing
            </Typography>
            <div className="flex items-baseline gap-1">
              <Typography variant="h4" className="font-data-tabular font-bold text-primary">
                {latestYield?.packingYield ? latestYield.packingYield.toFixed(2) : "0.00"}
              </Typography>
              <Typography variant="caption" className="font-bold text-primary">%</Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
