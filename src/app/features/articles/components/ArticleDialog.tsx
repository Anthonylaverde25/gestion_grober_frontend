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
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import { ArticleSchema, ArticleFormData } from '../schemas/ArticleSchema';
import { useClients } from '../../client/hooks/useClients';

interface ArticleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * ArticleDialog Component
 * Standardized industrial dialog for article creation.
 * Optimized for Dark Mode.
 */
export function ArticleDialog({ open, onClose, onSubmit, isSubmitting }: ArticleDialogProps) {
  const { clients, isLoading: isLoadingClients } = useClients();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      name: '',
      clientId: ''
    }
  });

  const handleFormSubmit = async (data: ArticleFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handled by useArticles
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
            Nuevo Artículo
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
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
            <span>Módulo: <Typography component="span" sx={{ fontSize: '10px', fontWeight: 900, color: 'text.primary' }}>Gestión de Catálogo</Typography></span>
          </Box>
          <Box className="flex gap-4 text-right">
            <span>Estado: <Typography component="span" sx={{ fontSize: '10px', fontWeight: 900, color: 'primary.main' }}>Borrador</Typography></span>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> Vínculo Comercial
                </Typography>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Cliente Propietario"
                      fullWidth
                      variant="outlined"
                      error={!!errors.clientId}
                      helperText={errors.clientId?.message}
                      disabled={isSubmitting || isLoadingClients}
                      sx={inputStyles}
                    >
                      <MenuItem value="">
                        <em style={{ fontSize: '13px', fontWeight: 500, color: theme.palette.text.secondary }}>Ninguno (Artículo Genérico)</em>
                      </MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id} sx={{ fontSize: '13px', fontWeight: 600 }}>
                          {client.commercialName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={sectionLabelStyles}>
                  <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> Especificaciones
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Artículo"
                      placeholder="Ej: Ladrillo Refractario A1"
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
                  {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Crear Artículo'}
              </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
