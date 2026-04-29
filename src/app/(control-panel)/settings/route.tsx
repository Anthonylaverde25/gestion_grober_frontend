import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SettingsAppView = lazy(() => import('./components/views/SettingsAppView'));
const AccountTabView = lazy(() => import('./components/views/AccountTabView'));
const FurnacesTabView = lazy(() => import('./components/views/FurnacesTabView'));
const MachinesTabView = lazy(() => import('./components/views/MachinesTabView'));
const NotificationsTabView = lazy(() => import('./components/views/NotificationsTabView'));
const TeamTabView = lazy(() => import('./components/views/TeamTabView'));

/**
 * The Settings App Route.
 */
const Route: FuseRouteItemType = {
        path: 'settings',
        element: (
                <SettingsAppView>
                        <Outlet />
                </SettingsAppView>
        ),
        children: [
                {
                        path: 'account',
                        element: <AccountTabView />
                },
                {
                        path: 'furnaces',
                        element: <FurnacesTabView />
                },
                {
                        path: 'machines',
                        element: <MachinesTabView />
                },
                {
                        path: 'notifications',
                        element: <NotificationsTabView />
                },
                {
                        path: 'team',
                        element: <TeamTabView />
                },
                {
                        path: '',
                        element: <Navigate to="account" />
                }
        ]
};
export default Route;
