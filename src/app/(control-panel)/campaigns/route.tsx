import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import CampaignsPage from '@/app/features/campaigns/pages/CampaignsPage';

/**
 * The Campaigns page route.
 */
const route: FuseRouteItemType = {
    path: 'campaigns',
    element: <CampaignsPage />
};

export default route;
