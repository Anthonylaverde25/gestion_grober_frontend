import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const SettingsAppNavigation: FuseNavItemType = {
	id: 'apps.settings',
	title: 'Settings',
	type: 'collapse',
	icon: 'lucide:settings',
	url: '/settings',
	children: [

		{
		        id: 'apps.settings.account',
		        icon: 'lucide:circle-user',
		        title: 'Account',
		        type: 'item',
		        url: '/settings/account',
		        subtitle: 'Manage your public profile and private information'
		},
		{
		        id: 'apps.settings.furnaces',
		        icon: 'lucide:flame',
		        title: 'Hornos',
		        type: 'item',
		        url: '/settings/furnaces',
		        subtitle: 'Configuración técnica y operativa de los hornos'
		},
		{
		        id: 'apps.settings.machines',
		        icon: 'lucide:cpu',
		        title: 'Máquinas',
		        type: 'item',
		        url: '/settings/machines',
		        subtitle: 'Gestión y mantenimiento de la maquinaria'
		},
		{
		        id: 'apps.settings.notifications',

			icon: 'lucide:bell',
			title: 'Notifications',
			type: 'item',
			url: '/settings/notifications',
			subtitle: "Manage when you'll be notified on which channels"
		},
		{
			id: 'apps.settings.team',
			icon: 'lucide:users',
			title: 'Team',
			type: 'item',
			url: '/settings/team',
			subtitle: 'Manage your existing team and change roles/permissions'
		}
	]
};

export default SettingsAppNavigation;
