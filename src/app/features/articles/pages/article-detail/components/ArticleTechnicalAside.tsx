import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

export default function ArticleTechnicalAside() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const specs = [
        { label: 'Peso Nominal', value: '450', unit: 'g', icon: 'weight' },
        { label: 'Capacidad Rebase', value: '750', unit: 'ml', icon: 'opacity' },
        { label: 'Diámetro Boca', value: '28', unit: 'mm', icon: 'radio_button_unchecked' },
        { label: 'Altura Total', value: '285', unit: 'mm', icon: 'height' },
        { label: 'Diámetro Cuerpo', value: '75', unit: 'mm', icon: 'Format_line_spacing' },
        { label: 'Tipo de Vidrio', value: 'Silicato', icon: 'science' },
        { label: 'Color Vidrio', value: 'Ámbar', icon: 'palette' },
        { label: 'Uso Principal', value: 'Bebidas', icon: 'liquor' },
        { label: 'Resistencia Térmica', value: '40', unit: '°C', icon: 'thermostat' },
        { label: 'Presión Máxima', value: '2.5', unit: 'bar', icon: 'speed' },
    ];

    return (
        <Box 
            component="aside" 
            sx={{ 
                width: 380, 
                flexShrink: 0, 
                borderRight: 1, 
                borderColor: 'divider', 
                bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f1f5f9', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            {/* Cabecera Sidebar */}
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span className="material-symbols-outlined text-primary text-[18px]">settings_input_component</span>
                    Especificaciones Técnicas
                </Typography>
            </Box>

            {/* Contenedor Único de Información y Activos */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Lista de Especificaciones */}
                {specs.map((item, idx) => (
                    <Box 
                        key={idx} 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            px: 2.5, 
                            py: 1.5, 
                            borderBottom: 1, 
                            borderColor: 'divider', 
                            bgcolor: idx % 2 === 0 ? 'background.paper' : alpha(theme.palette.background.default, 0.3),
                            '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : '#e2e8f0' } 
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                            <span className="material-symbols-outlined text-[14px] text-text-secondary">{item.icon}</span>
                            <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>{item.label}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 900, color: 'text.primary', fontFamily: 'monospace' }}>{item.value}</Typography>
                            {item.unit && <Typography sx={{ fontSize: '10px', fontWeight: 800, color: 'text.secondary' }}>{item.unit}</Typography>}
                        </Box>
                    </Box>
                ))}

                {/* Dropzone de Imagen */}
                <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                    <Box sx={{ 
                        width: '100%', 
                        height: 200, 
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: '8px', 
                        bgcolor: alpha(theme.palette.background.default, 0.5), 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 2, 
                        cursor: 'pointer', 
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : '#f1f5f9', 
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4]
                        } 
                    }}>
                        <span className="material-symbols-outlined text-text-secondary text-[32px]">add_a_photo</span>
                        <div className="text-center">
                            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.primary', textTransform: 'uppercase' }}>Imagen Técnica del Producto</Typography>
                            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'text.secondary', mt: 0.5 }}>Arrastra o haz clic para subir</Typography>
                        </div>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
