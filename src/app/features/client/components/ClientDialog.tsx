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
  useTheme,
  alpha
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { ClientSchema, ClientFormData } from '../schemas/ClientSchema';

interface ClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * ClientDialog Component
 * Standardized industrial dialog for client registration.
 * Optimized for Dark Mode.
 */
export function ClientDialog({ open, onClose, onSubmit, isSubmitting }: ClientDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      commercialName: '',
      businessName: '',
      taxId: '',
      technicalContact: '',
      email: ''
    }
  });

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Handled by hook
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      backgroundColor: 'background.paper',
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '14px',
      fontWeight: 500,
      color: 'text.primary'
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'text.secondary'
    }
  };

  const sectionLabelStyles = {
    color: 'text.primary',
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
        bgcolor: 'divider'
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
          boxShadow: theme.shadows[24],
          bgcolor: 'background.paper',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : "#e2e8f0", py: 1.5, px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Nuevo Cliente
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">business</span>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'background.paper' }}>
        {/* Barra de Metadatos Minimalista */}
        <Box 
            sx={{ 
                px: 3, 
                py: 1, 
                bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : alpha(theme.palette.primary.main, 0.05), 
                borderBottom: 1, 
                borderColor: 'divider', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '10px', 
                fontWeight: 800, 
                color: 'text.secondary', 
                textTransform: 'uppercase' 
            }}
        >
          <Box className="flex gap-4">
            <span>Tipo: <Typography component="span" sx={{ fontSize: '10px', fontWeight: 900, color: 'text.primary' }}>Entidad Comercial</Typography></span>
          </Box>
          <Box className="flex gap-4 text-right">
            <span>Estado: <Typography component="span" sx={{ fontSize: '10px', fontWeight: 900, color: 'primary.main' }}>Nuevo Registro</Typography></span>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={4} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> Datos de la Empresa
                </Typography>
                <Stack spacing={2}>
                  <Controller
                    name="commercialName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        autoFocus
                        label="Nombre Comercial"
                        placeholder="Escriba el nombre de fantasía"
                        fullWidth
                        variant="outlined"
                        error={!!errors.commercialName}
                        helperText={errors.commercialName?.message}
                        disabled={isSubmitting}
                        sx={inputStyles}
                      />
                    )}
                  />
                  <Stack direction="row" spacing={2}>
                    <Controller
                      name="businessName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Razón Social"
                          placeholder="Nombre legal"
                          fullWidth
                          variant="outlined"
                          error={!!errors.businessName}
                          helperText={errors.businessName?.message}
                          disabled={isSubmitting}
                          sx={inputStyles}
                        />
                      )}
                    />
                    <Controller
                      name="taxId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="CUIT / ID Fiscal"
                          placeholder="00-00000000-0"
                          fullWidth
                          variant="outlined"
                          error={!!errors.taxId}
                          helperText={errors.taxId?.message}
                          disabled={isSubmitting}
                          sx={inputStyles}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <ContactMailIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> Contacto y Notificaciones
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="technicalContact"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Persona de Contacto"
                        placeholder="Responsable"
                        fullWidth
                        variant="outlined"
                        error={!!errors.technicalContact}
                        helperText={errors.technicalContact?.message}
                        disabled={isSubmitting}
                        sx={inputStyles}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="E-mail"
                        placeholder="ejemplo@correo.com"
                        fullWidth
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={isSubmitting}
                        sx={inputStyles}
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
          
          <DialogActions sx={{ p: 2.5, px: 3, bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#f8fafc', borderTop: 1, borderColor: 'divider', justifyContent: 'space-between' }}>
              <Button 
                  onClick={handleClose} 
                  disabled={isSubmitting} 
                  sx={{ 
                      color: 'text.secondary', 
                      fontWeight: 800, 
                      fontSize: '11px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      borderRadius: 0,
                      '&:hover': { bgcolor: 'transparent', color: 'text.primary' }
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
                      bgcolor: isDark ? 'primary.main' : '#334155',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: 'none',
                      '&:hover': {
                          bgcolor: isDark ? 'primary.dark' : '#1e293b',
                          boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                          bgcolor: 'action.disabledBackground',
                          color: 'action.disabled'
                      }
                  }}
              >
                  {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Registrar Cliente'}
              </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
