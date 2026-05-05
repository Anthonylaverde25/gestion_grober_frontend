import { Box, Typography, Avatar, IconButton, Tooltip, Stack } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { SettingsTeamMember } from '../../types';

interface TeamListItemProps {
	member: SettingsTeamMember;
	onAlias?: (member: SettingsTeamMember) => void;
	onConfig?: (member: SettingsTeamMember) => void;
	onDelete?: (member: SettingsTeamMember) => void;
}

export function TeamListItem({ member, onAlias, onConfig, onDelete }: TeamListItemProps) {
	return (
		<Box sx={{ 
			display: 'flex', 
			alignItems: 'center', 
			px: 3, 
			py: 2,
			minHeight: '72px',
			cursor: 'pointer',
			'&:hover': { bgcolor: '#f7f9fc' },
			transition: 'background-color 0.2s ease'
		}}>
			<Avatar
				src={member.avatar}
				sx={{ 
					width: 40, 
					height: 40, 
					mr: 2,
					bgcolor: '#eff4f9',
					color: '#0070f2',
					fontSize: '14px',
					fontWeight: 700,
					border: '1px solid #d9d9d9'
				}}
			>
				{member.name?.charAt(0)}
			</Avatar>

			<Box sx={{ flex: 1 }}>
				<Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#32363a' }}>
					{member.name}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography sx={{ fontSize: '12px', color: '#6a6d70' }}>
						{member.email}
					</Typography>
					<Typography sx={{ fontSize: '12px', color: '#d9d9d9' }}>|</Typography>
					<Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#0070f2', textTransform: 'uppercase' }}>
						{member.role}
					</Typography>
				</Box>
			</Box>

			<Stack direction="row" spacing={0.5}>
				<Tooltip title="Alias">
					<IconButton 
						size="small" 
						onClick={(e) => { e.stopPropagation(); onAlias?.(member); }}
						sx={{ color: '#6a6d70', '&:hover': { color: '#0070f2' } }}
					>
						<FuseSvgIcon size={20}>heroicons-outline:finger-print</FuseSvgIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Configurar">
					<IconButton 
						size="small" 
						onClick={(e) => { e.stopPropagation(); onConfig?.(member); }}
						sx={{ color: '#6a6d70' }}
					>
						<FuseSvgIcon size={20}>heroicons-outline:cog-6-tooth</FuseSvgIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Eliminar">
					<IconButton 
						size="small" 
						onClick={(e) => { e.stopPropagation(); onDelete?.(member); }}
						sx={{ color: '#6a6d70', '&:hover': { color: '#bb0000' } }}
					>
						<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	);
}
