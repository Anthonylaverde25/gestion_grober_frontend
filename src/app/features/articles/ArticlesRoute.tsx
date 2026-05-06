import authRoles from "@auth/authRoles";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

/**
 * Articles Route Configuration
 * Exported as an array of Route items to be picked up by the dynamic route loader.
 */
const ArticlesRoute: FuseRouteItemType[] = [
  {
    path: "articles",
    auth: authRoles.user,
    children: [
      {
        path: "",
        element: <ArticlesPage />,
      },
      {
        path: ":articleId",
        element: <ArticleDetailPage />,
      }
    ]
  },
];

export default ArticlesRoute;
