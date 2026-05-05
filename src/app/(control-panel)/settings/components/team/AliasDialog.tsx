import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import { AliasSchema, AliasFormData } from '../../schemas/AliasSchema';
import { SettingsTeamMember } from '../../types';

interface AliasDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AliasFormData) => Promise<void>;
  isSubmitting: boolean;
  member: SettingsTeamMember | null;
}

export function AliasDialog({ open, onClose, onSubmit, isSubmitting, member }: AliasDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AliasFormData>({
    resolver: zodResolver(AliasSchema),
    defaultValues: {
      name: '',
      legajo: ''
    }
  });

  const handleFormSubmit = async (data: AliasFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#e2e8f0',
      },
      '&:hover fieldset': {
        borderColor: '#94a3b8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#475569',
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '14px',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#64748b'
    }
  };

  const sectionLabelStyles = {
    color: '#0f172a',
    fontWeight: 900,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    fontSize: '11px',
    mb: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&::after': {
      content: '""',
      flex: 1,
      height: '1px',
      bgcolor: '#f1f5f9'
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: "#e2e8f0", py: 1.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Nuevo Alias de Operario
          </Typography>
          <FingerprintIcon sx={{ color: '#0070f2', fontSize: '20px' }} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Barra de Metadatos Minimalista */}
        <Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <Box className="flex gap-4">
            <span>Terminal: <span className="text-on-surface">{member?.name || 'Cargando...'}</span></span>
          </Box>
          <Box className="flex gap-4 text-right">
            <span>Rol: <span className="text-primary">{member?.role || '...'}</span></span>
            <span>Tipo: <span className="text-on-surface font-data-tabular">Identidad Industrial</span></span>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <PersonIcon sx={{ fontSize: 16, color: '#475569' }} /> Identificación Nominal
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre Completo del Operario"
                      placeholder="Ej: Juan Pérez"
                      fullWidth
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={isSubmitting}
                      sx={inputStyles}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#475569' }} /> Registro Industrial
                </Typography>
                <Controller
                  name="legajo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número de Legajo"
                      placeholder="Ej: LEG-12345"
                      fullWidth
                      variant="outlined"
                      error={!!errors.legajo}
                      helperText={errors.legajo?.message}
                      disabled={isSubmitting}
                      sx={inputStyles}
                    />
                  )}
                />
              </Box>
            </Stack>
          </Box>

          <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
            <Button 
              onClick={handleClose} 
              disabled={isSubmitting} 
              sx={{ 
                color: '#64748b', 
                fontWeight: 800, 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderRadius: 0,
                '&:hover': { bgcolor: 'transparent', color: '#0f172a' }
              }}
            >
              Descartar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                borderRadius: 0,
                px: 3,
                py: 1,
                bgcolor: '#334155',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1e293b',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': {
                  bgcolor: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Crear Alias'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
