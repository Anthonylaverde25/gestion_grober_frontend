import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import ClientsPage from "./client/views/ClientsPage";
import ArticlesPage from "@/app/features/articles/pages/ArticlesPage";

/**
 * The Production Module routes.
 */
const route: FuseRouteItemType = {
  path: "administration",
  children: [
    {
      path: "clients",
      children: [
        {
          path: "",
          element: <ClientsPage />,
        },
      ],
    },
    {
      path: "articles",
      children: [
        {
          path: "",
          element: <ArticlesPage />,
        },
      ],
    },
  ],
};

export default route;
