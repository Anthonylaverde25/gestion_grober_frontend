import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import PageHeader from "@/app/components/PageHeader";
import { useParams, useNavigate } from "react-router";
import { useLineYieldHistory } from "@/app/features/production/hooks/useLineYieldHistory";
import { useCampaign } from "@/app/features/production/hooks/useCampaign";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import YieldCampaignHeader from "../components/campaign-logs/YieldCampaignHeader";
import YieldHistoryTable from "../components/campaign-logs/YieldHistoryTable";
import { Box } from "@mui/material";

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
  const navigate = useNavigate();


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
                <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                    Registros en Campaña
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-on-surface">
                      {history.length}
                    </span>
                    <span className="text-on-surface-variant mb-1 font-medium">
                      Entradas
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                    Promedio Forming Yield
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-on-surface-variant">
                      {avgForming}%
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                    Promedio Packing Yield
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-primary">
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
