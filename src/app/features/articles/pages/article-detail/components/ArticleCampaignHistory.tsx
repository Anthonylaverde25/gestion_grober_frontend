import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

interface ArticleCampaignHistoryProps {
    campaignStats: any[];
}

export default function ArticleCampaignHistory({ campaignStats }: ArticleCampaignHistoryProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '8px', overflow: 'hidden', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8fafc', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                <Typography sx={{ fontSize: '14px', fontWeight: 900, color: 'text.primary', textTransform: 'uppercase' }}>Historial Completo de Campañas</Typography>
            </Box>
            <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr style={{ backgroundColor: isDark ? theme.palette.background.paper : '#f1f5f9' }}>
                            {['Campaña', 'Periodo', 'Línea', 'Formado', 'Empaque', 'Estado'].map((h) => (
                                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-wider" style={{ color: theme.palette.text.secondary, borderBottom: `1px solid ${theme.palette.divider}` }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...campaignStats].reverse().map((c, i) => (
                            <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : alpha(theme.palette.background.default, 0.2) }} className="hover:bg-action-hover transition-colors">
                                <td className="px-6 py-3 border-b border-divider text-[11px] font-black" style={{ color: theme.palette.text.primary }}>{c.code}</td>
                                <td className="px-6 py-3 border-b border-divider text-[11px] font-bold" style={{ color: theme.palette.text.secondary }}>{c.date}</td>
                                <td className="px-6 py-3 border-b border-divider text-[11px] font-black" style={{ color: theme.palette.text.primary }}>{c.line}</td>
                                <td className="px-6 py-3 border-b border-divider text-[11px] font-black" style={{ color: theme.palette.text.primary }}>
                                    <Box component="span" sx={{ px: 1, py: 0.5, borderRadius: '4px', bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main }}>{c.forming.toFixed(1)}%</Box>
                                </td>
                                <td className="px-6 py-3 border-b border-divider text-[11px] font-black" style={{ color: theme.palette.text.primary }}>
                                    <Box component="span" sx={{ px: 1, py: 0.5, borderRadius: '4px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>{c.packing.toFixed(1)}%</Box>
                                </td>
                                <td className="px-6 py-3 border-b border-divider">
                                    <Box component="span" sx={{ 
                                        px: 1, 
                                        py: 0.25, 
                                        borderRadius: '4px', 
                                        fontSize: '9px', 
                                        fontWeight: 900, 
                                        textTransform: 'uppercase',
                                        bgcolor: c.status === 'En Curso' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                                        color: c.status === 'En Curso' ? theme.palette.primary.main : theme.palette.success.main
                                    }}>
                                        {c.status}
                                    </Box>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
}
