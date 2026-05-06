import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

interface ArticleSummaryHeaderProps {
    article: any;
}

export default function ArticleSummaryHeader({ article }: ArticleSummaryHeaderProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box 
            component="section" 
            sx={{ 
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.5) : '#e2e8f0',
                borderBottom: 1,
                borderColor: 'divider',
                px: 6,
                py: 4
            }}
        >
            <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center gap-gutter">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            {article.name}
                        </Typography>
                        <Box 
                            component="span" 
                            sx={{ 
                                px: 1, 
                                py: 0.25, 
                                borderRadius: '99px', 
                                fontSize: '10px', 
                                fontWeight: 800, 
                                border: 1, 
                                borderColor: isDark ? 'primary.dark' : 'primary.light',
                                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : 'primary.light',
                                color: isDark ? 'primary.light' : 'primary.dark',
                                textTransform: 'uppercase'
                            }}
                        >
                            Activo en Producción
                        </Box>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-1 text-[13px] font-bold uppercase tracking-wide">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                            <span>Código: <Typography component="span" sx={{ fontWeight: 900, color: 'text.primary' }}>#{article.id.split('-')[0].toUpperCase()}</Typography></span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <span className="material-symbols-outlined text-[16px]">business</span>
                            <span>Cliente: <Typography component="span" sx={{ fontWeight: 900, color: 'text.primary' }}>{article.client?.name || "Producción Interna"}</Typography></span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                            <span>Categoría: <Typography component="span" sx={{ fontWeight: 900, color: 'text.primary' }}>Envase de Vidrio</Typography></span>
                        </Box>
                    </div>
                </div>
                <div className="flex items-center gap-8 border-l border-divider pl-8 hidden md:flex">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '9px' }}>Campaña Actual</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>CAMP-2024-0100 (L-03)</Typography>
                            </div>
                            <div className="flex flex-col">
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', fontSize: '9px' }}>Periodo Producción</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>Mayo 2024</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}
