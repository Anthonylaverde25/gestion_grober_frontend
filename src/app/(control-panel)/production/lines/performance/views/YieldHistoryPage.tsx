import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled, useTheme } from "@mui/material/styles";
import PageHeader from "@/app/components/PageHeader";
import { useParams, useNavigate } from "react-router";
import { useLineYieldHistory } from "@/app/features/production/hooks/useLineYieldHistory";
import { useCampaign } from "@/app/features/production/hooks/useCampaign";
import CircularProgress from "@mui/material/CircularProgress";
import YieldCampaignHeader from "../components/campaign-logs/YieldCampaignHeader";
import YieldHistoryTable from "../components/campaign-logs/YieldHistoryTable";
import { Box, Typography } from "@mui/material";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    padding: 0,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function YieldHistoryPage() {
  const { campaignId } = useParams();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { campaign, isLoading: campaignLoading } = useCampaign(campaignId);
  const { history, isLoading: historyLoading } =
    useLineYieldHistory(campaignId);

  const isLoading = historyLoading || campaignLoading;
  const latestYield = history.length > 0 ? history[0] : null;

  const avgForming =
    history.length > 0
      ? (
        history.reduce((acc, curr) => acc + curr.formingYield, 0) /
        history.length
      ).toFixed(2)
      : "0.00";

  const avgPacking =
    history.length > 0
      ? (
        history.reduce((acc, curr) => acc + curr.packingYield, 0) /
        history.length
      ).toFixed(2)
      : "0.00";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
  };

  const labelStyle = {
    color: theme.palette.text.secondary
  };

  const valueStyle = {
    color: theme.palette.text.primary
  };

  return (
    <Root
      header={
        <PageHeader
          title="Monitor de Rendimiento"
          subtitle={`Trazabilidad de producción para la campaña: ${campaign?.codigo || campaignId}`}
        />
      }
      content={
        <Box className="flex flex-col flex-auto h-full">
          {/* Header de Resumen de Campaña - Ancho Completo */}
          <YieldCampaignHeader campaign={campaign} latestYield={latestYield} />

          <div className="pb-16 px-margin-edge max-w-[1600px] mx-auto w-full pt-8 flex flex-col gap-8">
            {/* Dashboard Summary Section */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="border p-stack-md flex flex-col gap-1 rounded-none shadow-none" style={cardStyle}>
                  <span className="font-label-caps text-label-caps uppercase text-[10px]" style={labelStyle}>
                    Registros en Campaña
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold" style={valueStyle}>
                      {history.length}
                    </span>
                    <span className="mb-1 font-medium" style={labelStyle}>
                      Entradas
                    </span>
                  </div>
                </div>

                <div className="border p-stack-md flex flex-col gap-1 rounded-none shadow-none" style={cardStyle}>
                  <span className="font-label-caps text-label-caps uppercase text-[10px]" style={labelStyle}>
                    Promedio Forming Yield
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold" style={labelStyle}>
                      {avgForming}%
                    </span>
                  </div>
                </div>

                <div className="border p-stack-md flex flex-col gap-1 rounded-none shadow-none" style={cardStyle}>
                  <span className="font-label-caps text-label-caps uppercase text-[10px]" style={labelStyle}>
                    Promedio Packing Yield
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold" style={{ color: theme.palette.primary.main }}>
                      {avgPacking}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabla de Trazabilidad Histórica */}
            <YieldHistoryTable
              history={history}
              campaign={campaign}
              isLoading={isLoading}
            />
          </div>
        </Box>
      }
    />
  );
}
