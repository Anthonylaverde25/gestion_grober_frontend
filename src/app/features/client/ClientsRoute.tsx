import authRoles from "@auth/authRoles";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import ClientsPage from "./pages/ClientsPage";

/**
 * Clients Route Configuration
 * Exported as an array of Route items to be picked up by the dynamic route loader.
 */
const ClientsRoute: FuseRouteItemType[] = [
  {
    path: "clients",
    element: <ClientsPage />,
    auth: authRoles.user,
  },
];

export default ClientsRoute;
