import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTheme, alpha } from '@mui/material/styles';

interface DashboardSubheaderProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
}

/**
 * DashboardSubheader Component
 * Navigation tabs for the main Dashboard view.
 * Optimized for Dark Mode.
 */
export default function DashboardSubheader({ activeTab, setActiveTab }: DashboardSubheaderProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                mb: 6,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 48,
                minHeight: 48,
                px: { xs: 2, sm: 4 }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: { xs: 1, sm: 4 },
                    height: '100%',
                    alignItems: 'center'
                }}
            >
                {['Resumen', 'Tableros', 'Rendimiento'].map((label, index) => (
                    <Button
                        key={label}
                        onClick={() => setActiveTab(index)}
                        sx={{
                            height: '100%',
                            borderRadius: 0,
                            fontSize: 13,
                            fontWeight: activeTab === index ? 900 : 600,
                            textTransform: 'none',
                            color: activeTab === index 
                                ? (isDark ? '#ffffff' : 'primary.main') 
                                : 'text.secondary',
                            borderBottom: '3px solid',
                            borderBottomColor: activeTab === index 
                                ? (isDark ? '#ffffff' : 'primary.main') 
                                : 'transparent',
                            px: 2,
                            minWidth: 'auto',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                color: isDark ? '#ffffff' : 'primary.main'
                            }
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.05) } }} 
                    title="Generar Vista Compuesta"
                >
                    <FuseSvgIcon size={18}>heroicons-outline:view-columns</FuseSvgIcon>
                </IconButton>
                <IconButton 
                    size="small" 
                    sx={{ color: 'text.secondary', '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.05) } }}
                >
                    <FuseSvgIcon size={18}>heroicons-outline:refresh</FuseSvgIcon>
                </IconButton>
            </Box>
        </Box >
    );
}
