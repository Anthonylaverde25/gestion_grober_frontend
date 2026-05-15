import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { useTheme, alpha } from '@mui/material/styles';
import { Machine } from '@/app/core/domain/entities/Machine';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface ActiveProductionSummaryProps {
  machines: Array<{
    id: string;
    name: string;
    status: string;
    current_article_name: string;
    current_client_name: string;
    current_campaign_id: string;
    latest_yield: any;
  }>;
}

export default function ActiveProductionSummary({ machines = [] }: ActiveProductionSummaryProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!machines || machines.length === 0) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'operational':
        return { label: 'OPERATIVA', color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) };
      case 'maintenance':
        return { label: 'MANTENIMIENTO', color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) };
      case 'shutdown':
        return { label: 'DETENIDA', color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) };
      default:
        return { label: 'DESCONOCIDO', color: theme.palette.grey[500], bg: alpha(theme.palette.grey[500], 0.1) };
    }
  };
  const hasData = machines && machines.length > 0;

  return (
    <Box sx={{ flex: 1, mb: 6, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1 }}>
        <Typography sx={{ 
          fontSize: 11, 
          fontWeight: 800, 
          color: 'text.disabled', 
          letterSpacing: '0.1em', 
          textTransform: 'uppercase', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          Líneas de Producción
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'primary.main', fontWeight: 800 }}>
          {machines.length} ACTIVAS
        </Typography>
      </Box>
      
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: '1px solid',
          borderColor: isDark ? alpha(theme.palette.divider, 0.5) : '#e2e8f0',
          borderRadius: 1,
          backgroundColor: 'background.paper',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 350
        }}
      >
        {!hasData ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.disabled', fontWeight: 600, fontSize: 13 }}>
              No hay producción activa en este momento.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Spreadsheet Header (Fiori Style) */}
            <Box sx={{ 
              display: 'flex', 
              bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#f8fafc',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Box sx={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5), py: 1.5 }}>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: 'text.disabled' }}>#</Typography>
              </Box>
              <Box sx={{ flex: 1.5, px: 2, py: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary' }}>MÁQUINA</Typography>
              </Box>
              <Box sx={{ flex: 2, px: 2, py: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary' }}>ARTÍCULO</Typography>
              </Box>
              <Box sx={{ flex: 2, px: 2, py: 1.5, borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary' }}>CLIENTE</Typography>
              </Box>
              <Box sx={{ width: 80, px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary' }}>REND.</Typography>
              </Box>
            </Box>

            {/* Spreadsheet Rows */}
            {machines.map((machine, index) => (
              <Box
                key={machine.id}
                sx={{
                  display: 'flex',
                  borderBottom: '1px solid',
                  borderColor: isDark ? alpha(theme.palette.divider, 0.3) : '#f1f5f9',
                  transition: 'background-color 0.1s',
                  '&:hover': {
                    backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.05) : '#f8faff'
                  }
                }}
              >
                <Box sx={{ width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3), bgcolor: isDark ? alpha(theme.palette.background.default, 0.2) : '#fcfdfe' }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.disabled', fontFamily: 'monospace' }}>
                    {index + 1}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1.5, px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3), gap: 1.5 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
                    {machine.name}
                  </Typography>
                </Box>

                <Box sx={{ flex: 2, px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3) }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
                    {machine.current_article_name || '---'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 2, px: 2, py: 1.5, display: 'flex', alignItems: 'center', borderRight: '1px solid', borderColor: alpha(theme.palette.divider, 0.3) }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
                    {machine.current_client_name || 'Stock Interno'}
                  </Typography>
                </Box>

                <Box sx={{ width: 80, px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ 
                    fontSize: 12, 
                    fontWeight: 800, 
                    color: (machine.latest_yield?.percentage || 0) > 85 ? 'success.main' : (machine.latest_yield?.percentage || 0) > 70 ? 'warning.main' : 'error.main',
                    fontFamily: 'monospace'
                  }}>
                    {machine.latest_yield ? `${machine.latest_yield.percentage.toFixed(0)}%` : '0%'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
