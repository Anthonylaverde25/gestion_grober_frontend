import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface StatItemProps {
    color: string;
    label: string;
    value: string;
}

function StatItem({ color, label, value }: StatItemProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
                <Typography sx={{ fontSize: 13, color: '#191c1e' }}>{label}</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#191c1e' }}>{value}</Typography>
        </Box>
    );
}

export default function PassFailSummary() {
    return (
        <Paper sx={{ p: 3, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#191c1e', mb: 2 }}>Pass/Fail Summary</Typography>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="80" cy="80" r="70" fill="transparent" stroke="#eceef0" strokeWidth="12" />
                        <circle cx="80" cy="80" r="70" fill="transparent" stroke="#0058c2" strokeWidth="12" strokeDasharray="440" strokeDashoffset="44" />
                    </svg>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#191c1e' }}>91.4%</Typography>
                        <Typography sx={{ fontSize: 11, color: '#727786', fontWeight: 700, textTransform: 'uppercase' }}>Pass Rate</Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <StatItem color="#0058c2" label="Grade A (Premium)" value="78.2%" />
                    <StatItem color="#aec6ff" label="Grade B (Standard)" value="13.2%" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, mt: 1, borderTop: '1px solid #c1c6d7' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ba1a1a' }}>
                            <FuseSvgIcon size={16}>heroicons-outline:x-circle</FuseSvgIcon>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Rejected</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#ba1a1a' }}>8.6%</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
