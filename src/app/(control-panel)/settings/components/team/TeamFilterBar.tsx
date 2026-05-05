import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TeamFilterBarProps {
	value: string;
	onChange: (value: string) => void;
}

export function TeamFilterBar({ value, onChange }: TeamFilterBarProps) {
	return (
		<Box sx={{ px: 3, py: 2, bgcolor: '#f7f9fc', borderBottom: '1px solid #f2f2f2' }}>
			<TextField
				fullWidth
				placeholder="Filtrar por nombre, correo o rol..."
				variant="outlined"
				size="small"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				sx={{
					backgroundColor: 'white',
					'& .MuiOutlinedInput-root': {
						borderRadius: '6px',
						fontSize: '13px',
						'& fieldset': { borderColor: '#d9d9d9' },
						'&:hover fieldset': { borderColor: '#0070f2' },
					}
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon sx={{ color: '#6a6d70', fontSize: 18 }} />
						</InputAdornment>
					),
				}}
			/>
		</Box>
	);
}
