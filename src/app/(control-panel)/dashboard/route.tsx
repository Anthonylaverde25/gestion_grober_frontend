import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const DashboardView = lazy(() => import('./views/Dashboard'));

/**
 * The Example page route.
 */
const route: FuseRouteItemType = {
    path: 'dashboard',
    element: <DashboardView />
};

export default route;
