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
			py: 3, 
			borderBottom: '1px solid #f2f2f2',
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'space-between',
			bgcolor: 'white'
		}}>
			<Box sx={{ flex: 1 }}>
				<Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
					{title}
				</Typography>
				{description && (
					<Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.5 }}>
						{description}
					</Typography>
				)}
			</Box>
			
			{action && (
				<Button
					variant="contained"
					disableElevation
					startIcon={action.icon}
					onClick={action.onClick}
					disabled={action.disabled || action.loading}
					sx={{ 
						bgcolor: '#0f172a',
						'&:hover': { bgcolor: '#1e293b' },
						borderRadius: '6px',
						fontSize: '13px',
						fontWeight: 600,
						textTransform: 'none',
						px: 2,
						height: '36px'
					}}
				>
					{action.label}
				</Button>
			)}
		</Box>
	);
}
