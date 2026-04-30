import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import Box from '@mui/material/Box';

interface MachineMiniChartProps {
    data: any[];
    color: string;
}

export default function MachineMiniChart({ data, color }: MachineMiniChartProps) {
    return (
        <Box sx={{ width: '100%', height: 40, mt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <YAxis hide domain={[70, 100]} />
                    <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke={color} 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}
