import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TeamHeaderProps {
	count: number;
	onAddUser?: () => void;
}

export function TeamHeader({ count, onAddUser }: TeamHeaderProps) {
	return (
		<Box sx={{ 
			px: 3, 
			py: 2.5, 
			borderBottom: '1px solid #f2f2f2',
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'space-between' 
		}}>
			<Box sx={{ flex: 1 }}>
				<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#32363a', letterSpacing: '-0.01em' }}>
					Integrantes del Equipo
				</Typography>
				<Typography sx={{ fontSize: '12px', color: '#6a6d70' }}>
					{count} usuarios registrados en el sistema
				</Typography>
			</Box>
			
			<Button
				variant="contained"
				disableElevation
				startIcon={<AddIcon />}
				onClick={onAddUser}
				sx={{ 
					bgcolor: '#0070f2',
					'&:hover': { bgcolor: '#005bbd' },
					borderRadius: '6px',
					fontSize: '13px',
					fontWeight: 600,
					textTransform: 'none',
					px: 2,
					height: '36px'
				}}
			>
				Añadir Usuario
			</Button>
		</Box>
	);
}
