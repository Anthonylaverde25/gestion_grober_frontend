import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#4e6070' }}>{label}</Typography>
        </Box>
    );
}

function Bar({ height, active, disabled }: { height: string; active?: boolean; disabled?: boolean }) {
    return (
        <Box 
            sx={{ 
                flex: 1, 
                borderRadius: '2px 2px 0 0', 
                backgroundColor: active ? '#0058c2' : disabled ? '#eceef0' : '#aec6ff',
                height,
                transition: 'height 0.5s'
            }} 
        />
    );
}

export default function BatchProgression() {
    return (
        <Paper sx={{ p: 3, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
            <Box className="flex justify-between items-start mb-24">
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#191c1e' }}>Batch Progression</Typography>
                    <Typography sx={{ fontSize: 13, color: '#4e6070' }}>Real-time status of current manufacturing batches</Typography>
                </Box>
                <Box className="flex gap-16">
                    <Legend color="#0058c2" label="Completed" />
                    <Legend color="#aec6ff" label="In Progress" />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 180 }}>
                <Bar height="90%" active />
                <Bar height="85%" active />
                <Bar height="95%" active />
                <Bar height="40%" />
                <Bar height="60%" />
                <Bar height="10%" disabled />
                <Bar height="10%" disabled />
                <Bar height="10%" disabled />
            </Box>
            <Box className="flex justify-between mt-8 px-1">
                {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(t => (
                    <Typography key={t} sx={{ fontSize: 11, color: '#727786' }}>{t}</Typography>
                ))}
            </Box>
        </Paper>
    );
}
