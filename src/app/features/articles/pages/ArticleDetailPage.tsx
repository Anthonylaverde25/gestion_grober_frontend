import { useParams, useNavigate } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PageHeader from '@/app/components/PageHeader';
import { useArticle } from '../hooks/useArticle';
import CircularProgress from '@mui/material/CircularProgress';
import ArticleSummaryHeader from './article-detail/components/ArticleSummaryHeader';
import ArticleTechnicalAside from './article-detail/components/ArticleTechnicalAside';
import ArticlePerformanceChart from './article-detail/components/ArticlePerformanceChart';
import ArticleCampaignHistory from './article-detail/components/ArticleCampaignHistory';

const Root = styled(FusePageSimple)(({ theme }) => ({
    "& .FusePageSimple-header": {
        backgroundColor: theme.palette.background.paper,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.divider,
    },
    "& .FusePageSimple-content": {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        padding: 0,
        backgroundColor: theme.palette.background.default,
    },
}));

export default function ArticleDetailPage() {
    const { articleId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { article, isLoading, error } = useArticle(articleId);

    const handleBack = () => navigate('/articles');

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center h-full">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !article) {
        return (
            <Box className="flex flex-col items-center justify-center h-full gap-4">
                <Typography variant="h6" color="error">Error al cargar el artículo</Typography>
                <Button onClick={handleBack}>Volver al listado</Button>
            </Box>
        );
    }

    const generateCampaignStats = () => {
        const stats = [];
        const lines = ['L-01', 'L-02', 'L-03', 'L-04'];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        for (let i = 1; i <= 250; i++) {
            const year = 2010 + Math.floor(i / 20);
            const month = months[i % 12];
            stats.push({
                id: `C-${i.toString().padStart(3, '0')}`,
                code: `CAMP-${year}-${i.toString().padStart(4, '0')}`,
                line: lines[Math.floor(Math.random() * lines.length)],
                date: `${month} ${year}`,
                forming: Math.max(82, Math.min(99, 90 + (Math.random() - 0.5) * 10)),
                packing: Math.max(78, Math.min(97, 86 + (Math.random() - 0.5) * 12)),
                status: i === 250 ? 'En Curso' : 'Completada',
                color: i === 250 ? theme.palette.primary.main : theme.palette.success.main
            });
        }
        return stats;
    };

    const campaignStats = generateCampaignStats();

    return (
        <Root
            header={
                <PageHeader
                    title={<Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>Ficha Técnica del Artículo</Typography>}
                    subtitle="Monitorización de rendimiento y especificaciones industriales"
                    actions={
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button variant="outlined" startIcon={<span className="material-symbols-outlined">download</span>} sx={{ borderRadius: '8px', fontWeight: 800, textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>Descargar Ficha</Button>
                            <Button variant="contained" color="secondary" sx={{ borderRadius: '8px', fontWeight: 800, textTransform: 'none' }}>Editar Artículo</Button>
                        </Box>
                    }
                />
            }
            content={
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', bgcolor: 'background.default' }}>
                    
                    <ArticleSummaryHeader article={article} />

                    <Box sx={{ display: 'flex', flex: '1 1 auto', minHeight: 0 }}>
                        
                        <ArticleTechnicalAside />

                        <Box sx={{ flex: '1 1 auto', p: 6, bgcolor: 'background.paper', overflowY: 'auto' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                
                                <ArticlePerformanceChart 
                                    campaignStats={campaignStats} 
                                    articleName={article.name} 
                                />

                                <ArticleCampaignHistory 
                                    campaignStats={campaignStats} 
                                />

                            </Box>
                        </Box>
                    </Box>
                </Box>
            }
        />
    );
}