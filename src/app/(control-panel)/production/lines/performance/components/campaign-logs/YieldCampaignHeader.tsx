import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { LineYield } from "@/app/core/domain/entities/LineYield";
import { useTheme, alpha } from "@mui/material/styles";

interface YieldCampaignHeaderProps {
  campaign?: Campaign | null;
  latestYield?: LineYield | null;
}

export default function YieldCampaignHeader({ campaign, latestYield }: YieldCampaignHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const headerBg = isDark ? alpha(theme.palette.primary.main, 0.1) : "#e2e8f0";

  return (
    <section className="border-b px-margin-edge py-gutter shadow-none rounded-none" style={{ backgroundColor: headerBg, borderColor: theme.palette.divider }}>
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center gap-gutter">
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
            <Typography variant="h5" className="font-black uppercase tracking-tight" sx={{ color: 'text.primary' }}>
              {campaign?.machineName || "Línea de Producción"}
            </Typography>
            <span 
                className="px-2 py-0.5 self-center md:self-auto rounded-full text-[10px] font-bold border uppercase tracking-wider"
                style={{ 
                    backgroundColor: isDark ? alpha(theme.palette.success.main, 0.1) : '#dcfce7',
                    color: isDark ? theme.palette.success.light : '#166534',
                    borderColor: isDark ? alpha(theme.palette.success.main, 0.3) : '#bbf7d0'
                }}
            >
              Campaña Activa
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-1 text-[13px] font-bold uppercase tracking-wide" style={{ color: theme.palette.text.secondary }}>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">business</span>
              <span>Cliente: <span style={{ color: theme.palette.text.primary }}>{campaign?.client?.name || "N/A"}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              <span>Artículo: <span style={{ color: theme.palette.text.primary }}>{campaign?.article?.name || "N/A"}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">event</span>
              <span>Inicio: <span className="font-data-tabular" style={{ color: theme.palette.text.primary }}>
                {campaign?.startedAt ? format(new Date(campaign.startedAt), "dd/MM/yyyy HH:mm") : "N/A"}
              </span></span>
            </div>
          </div>
        </div>

        <div className="flex gap-gutter border-l pl-gutter hidden md:flex" style={{ borderColor: isDark ? alpha(theme.palette.divider, 0.5) : 'rgba(0,0,0,0.1)' }}>
          <div className="flex flex-col items-end text-right">
            <Typography variant="caption" className="uppercase font-black tracking-widest text-[9px]" style={{ color: theme.palette.text.secondary }}>
              Último Forming
            </Typography>
            <div className="flex items-baseline gap-1">
              <Typography variant="h4" className="font-data-tabular font-bold" style={{ color: theme.palette.text.primary }}>
                {latestYield?.formingYield ? latestYield.formingYield.toFixed(2) : "0.00"}
              </Typography>
              <Typography variant="caption" className="font-bold" style={{ color: theme.palette.text.secondary }}>%</Typography>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <Typography variant="caption" className="uppercase font-black tracking-widest text-[9px]" style={{ color: theme.palette.text.secondary }}>
              Último Packing
            </Typography>
            <div className="flex items-baseline gap-1">
              <Typography variant="h4" className="font-data-tabular font-bold" style={{ color: theme.palette.primary.main }}>
                {latestYield?.packingYield ? latestYield.packingYield.toFixed(2) : "0.00"}
              </Typography>
              <Typography variant="caption" className="font-bold" style={{ color: theme.palette.primary.main }}>%</Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
