import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface SettingsHeaderProps {
	title: string;
	description?: string;
	action?: {
		label: string;
		icon?: ReactNode;
		onClick: () => void;
		loading?: boolean;
		disabled?: boolean;
	};
}

export function SettingsHeader({ title, description, action }: SettingsHeaderProps) {
	return (
		<Box sx={{ 
			px: 3, 
			py: 2, 
			borderBottom: '1px solid',
			borderColor: 'divider',
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'space-between',
			bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f8fafc'
		}}>
			<Box sx={{ flex: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', textTransform: 'uppercase', fontSize: '16px' }}>
					{title}
				</Typography>
				{description && (
					<Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.2, opacity: 0.8 }}>
						{description}
					</Typography>
				)}
			</Box>
			
			{action && (
				<Button
					variant="contained"
					color="primary"
					className="btn-primary"
					startIcon={action.icon}
					onClick={action.onClick}
					disabled={action.disabled || action.loading}
				>
					{action.label}
				</Button>
			)}
		</Box>
	);
}
