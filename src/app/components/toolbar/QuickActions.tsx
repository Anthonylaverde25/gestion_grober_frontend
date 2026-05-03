import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Divider, Stack } from '@mui/material';

/**
 * QuickActions Component
 * Professional Fuse-styled Console with Blur Backdrop.
 */
export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAction = (path: string) => {
    navigate(path);
    handleClose();
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 540 },
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 0,
    outline: 'none',
    overflow: 'hidden',
    border: '1px solid',
    borderColor: 'divider'
  };

  const actionButtonStyle = {
    p: 3,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    transition: 'all 0.2s ease-in-out',
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      bgcolor: 'action.hover',
      '& .action-icon-container': {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        transform: 'scale(1.1)'
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Acciones Rápidas" placement="bottom">
        <IconButton
          onClick={handleOpen}
          sx={{
            width: 40,
            height: 40,
            color: 'inherit',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <FuseSvgIcon size={20}>heroicons-outline:bolt</FuseSvgIcon>
        </IconButton>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { 
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
            }
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            {/* Header Moderno */}
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', p: 1, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '8px' }}>
                    <FuseSvgIcon size={18}>heroicons-outline:command-line</FuseSvgIcon>
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                    Panel de Operaciones
                    </Typography>
                    <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary' }}>
                    Acceso rápido a flujos de trabajo críticos
                    </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={handleClose} sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider />

            <Stack>
              <Box sx={actionButtonStyle} onClick={() => handleAction('/production/lines-performance')}>
                <Box className="action-icon-container" sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 1.5, borderRadius: '12px', display: 'flex', transition: 'all 0.2s' }}>
                   <PrecisionManufacturingIcon />
                </Box>
                <Box>
                   <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary' }}>REGISTRAR RENDIMIENTO (YIELD)</Typography>
                   <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Carga de datos de formación y empaque por línea.</Typography>
                </Box>
              </Box>

              <Box sx={actionButtonStyle} onClick={() => handleAction('/production/campaigns')}>
                <Box className="action-icon-container" sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 1.5, borderRadius: '12px', display: 'flex', transition: 'all 0.2s' }}>
                   <AddIcon />
                </Box>
                <Box>
                   <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary' }}>INICIAR NUEVA CAMPAÑA</Typography>
                   <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Apertura de órdenes de producción y configuración.</Typography>
                </Box>
              </Box>

              <Box sx={actionButtonStyle} onClick={() => handleAction('/dashboard')}>
                <Box className="action-icon-container" sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 1.5, borderRadius: '12px', display: 'flex', transition: 'all 0.2s' }}>
                   <AssessmentIcon />
                </Box>
                <Box>
                   <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary' }}>GENERAR INFORME DE PLANTA</Typography>
                   <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Visualización analítica del desempeño global.</Typography>
                </Box>
              </Box>

              <Box sx={{ ...actionButtonStyle, borderBottom: 'none' }} onClick={() => handleAction('/production/lines-performance')}>
                <Box className="action-icon-container" sx={{ bgcolor: 'action.selected', color: 'text.secondary', p: 1.5, borderRadius: '12px', display: 'flex', transition: 'all 0.2s' }}>
                   <DescriptionIcon />
                </Box>
                <Box>
                   <Typography sx={{ fontSize: '14px', fontWeight: 800, color: 'text.primary' }}>TRAZABILIDAD HISTÓRICA</Typography>
                   <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Consulta de auditoría y registros archivados.</Typography>
                </Box>
              </Box>
            </Stack>

            {/* Footer Fuse Style */}
            <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
               <Typography sx={{ fontSize: '10px', color: 'text.disabled', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Gestión Grober • Inteligencia Operativa
               </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
