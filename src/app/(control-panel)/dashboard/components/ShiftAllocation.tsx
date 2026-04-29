import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface ShiftProgressProps {
    label: string;
    name: string;
    value: number;
}

function ShiftProgress({ label, name, value }: ShiftProgressProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#d2e5f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374958', fontWeight: 700, fontSize: 12 }}>
                {label}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#191c1e' }}>{name}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#191c1e' }}>{value}%</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 6, backgroundColor: '#eceef0', borderRadius: 10, overflow: 'hidden' }}>
                    <Box sx={{ width: `${value}%`, height: '100%', backgroundColor: '#0058c2', transition: 'width 1s' }} />
                </Box>
            </Box>
        </Box>
    );
}

export default function ShiftAllocation() {
    return (
        <Paper sx={{ p: 3, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#191c1e', mb: 3 }}>Shift Allocation</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ShiftProgress label="S1" name="Morning Shift" value={92} />
                <ShiftProgress label="S2" name="Afternoon Shift" value={78} />
                <ShiftProgress label="S3" name="Night Shift" value={64} />
            </Box>
        </Paper>
    );
}
