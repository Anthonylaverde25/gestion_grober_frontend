import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface DefectBarProps {
    value: string;
    label: string;
    height: string;
    color: string;
}

function DefectBar({ value, label, height, color }: DefectBarProps) {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Box 
                sx={{ 
                    width: '100%', 
                    backgroundColor: color, 
                    opacity: 0.9, 
                    borderRadius: '2px 2px 0 0', 
                    height, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'end',
                    pb: 0.5,
                    transition: 'all 0.3s',
                    '&:hover': { opacity: 1 }
                }}
            >
                <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{value}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, mt: 1, color: '#191c1e', fontWeight: 500, textAlign: 'center', lineHeight: 1.1 }}>{label}</Typography>
        </Box>
    );
}

export default function QualityControlDistribution() {
    return (
        <Paper sx={{ p: 3, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Box className="flex justify-between items-start mb-24">
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#191c1e' }}>Glass Container Defect Distribution</Typography>
                    <Typography sx={{ fontSize: 13, color: '#4e6070' }}>Specific defect types detected in the current production run</Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select 
                        value={0} 
                        sx={{ 
                            fontSize: 11, 
                            fontWeight: 600, 
                            backgroundColor: '#f8f9fb',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c1c6d7' }
                        }}
                    >
                        <MenuItem value={0} sx={{ fontSize: 11 }}>Current Batch: B-9402</MenuItem>
                        <MenuItem value={1} sx={{ fontSize: 11 }}>Previous Batch: B-9401</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 2, height: 200, pt: 1, px: 1, position: 'relative' }}>
                {/* Chart Grid Lines Mockup */}
                <Box sx={{ position: 'absolute', inset: 0, top: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', opacity: 0.3 }}>
                    {[...Array(5)].map((_, i) => (
                        <Box key={i} sx={{ borderTop: i === 4 ? '1px solid #e0e3e5' : '1px dashed #e0e3e5', width: '100%' }} />
                    ))}
                </Box>
                <DefectBar value="124" label="Bubbles/Seeds" height="45%" color="#0070f2" />
                <DefectBar value="45" label="Stones" height="22%" color="#ca4e00" />
                <DefectBar value="286" label="Checking/Cracks" height="82%" color="#4e6070" />
                <DefectBar value="92" label="Dimensional" height="35%" color="#aec6ff" />
                <DefectBar value="156" label="Wall Thickness" height="60%" color="#d8dadc" />
            </Box>
        </Paper>
    );
}
