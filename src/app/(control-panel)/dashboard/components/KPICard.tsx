import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface KPICardProps {
    title: string;
    value: string;
    unit?: string;
    trend: string;
    icon: string;
    trendColor: string;
}

export default function KPICard({ title, value, unit, trend, icon, trendColor }: KPICardProps) {
    return (
        <Paper sx={{ p: 2, border: '1px solid #c1c6d7', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#4e6070', textTransform: 'uppercase', mb: 0.5 }}>{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#191c1e' }}>{value}</Typography>
                {unit && <Typography sx={{ fontSize: 13, color: '#727786' }}>{unit}</Typography>}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, color: trendColor }}>
                <FuseSvgIcon size={12}>{icon}</FuseSvgIcon>
                <Typography sx={{ fontSize: 11, fontWeight: 500 }}>{trend}</Typography>
            </Box>
        </Paper>
    );
}
