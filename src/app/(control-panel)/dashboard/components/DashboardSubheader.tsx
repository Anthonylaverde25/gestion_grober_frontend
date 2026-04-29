import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface DashboardSubheaderProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
}

export default function DashboardSubheader({ activeTab, setActiveTab }: DashboardSubheaderProps) {
    return (
        <Box
            className="w-full bg-white border-b border-slate-200 mb-16"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 48,
                minHeight: 48
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                    height: '100%',
                    alignItems: 'center'
                }}
            >
                {['Resumen', 'Tableros'].map((label, index) => (
                    <Button
                        key={label}
                        onClick={() => setActiveTab(index)}
                        sx={{
                            height: '100%',
                            borderRadius: 0,
                            fontSize: 13,
                            fontWeight: activeTab === index ? 700 : 500,
                            textTransform: 'none',
                            color: activeTab === index ? '#0058c2' : '#414754',
                            borderBottom: activeTab === index ? '3px solid #0058c2' : '3px solid transparent',
                            px: 2,
                            minWidth: 'auto',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 88, 194, 0.04)',
                                color: '#0058c2'
                            }
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </Box>

            <Box className="flex items-center gap-16">
                <IconButton size="small" sx={{ color: '#414754', '&:hover': { backgroundColor: '#f2f4f6' } }} title="Generar Vista Compuesta">
                    <FuseSvgIcon size={18}>heroicons-outline:view-columns</FuseSvgIcon>
                </IconButton>
                <IconButton size="small" sx={{ color: '#414754', '&:hover': { backgroundColor: '#f2f4f6' } }}>
                    <FuseSvgIcon size={18}>heroicons-outline:refresh</FuseSvgIcon>
                </IconButton>
            </Box>
        </Box >
    );
}
