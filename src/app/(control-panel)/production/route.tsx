import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import { ExtractionPage, ExtractionMachineHistory } from "./extraction/views";
import LinesPerformancePage from "./lines/performance/views/LinesPerformancePage";
import YieldHistoryPage from "./lines/performance/views/YieldHistoryPage";

/**
 * The Production Module routes.
 */
const route: FuseRouteItemType = {
  path: "production",
  children: [
    {
      path: "extraction",
      children: [
        {
          path: "",
          element: <ExtractionPage />,
        },
        {
          path: ":machineId/history",
          element: <ExtractionMachineHistory />,
        },
        {
          path: "history", // For general history if no machineId is provided
          element: <ExtractionMachineHistory />,
        },
      ],
    },
    {
      path: "lines-performance",
      children: [
        {
          path: "",
          element: <LinesPerformancePage />,
        },
        {
          path: ":campaignId/history",
          element: <YieldHistoryPage />,
        },
      ],
    },
  ],
};

export default route;
