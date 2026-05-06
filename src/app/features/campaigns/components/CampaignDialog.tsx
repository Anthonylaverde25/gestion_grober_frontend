import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Stack,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CampaignSchema, CampaignFormData } from '../schemas/CampaignSchema';
import { useMachines } from '@/app/(control-panel)/settings/api/hooks/machines/useMachines';
import { useArticles } from '@/app/features/articles/hooks/useArticles';
import { useClients } from '@/app/features/client/hooks/useClients';
import { useTheme, alpha } from '@mui/material/styles';

interface CampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function CampaignDialog({ open, onClose, onSubmit, isSubmitting }: CampaignDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { machines } = useMachines();
  const { articles } = useArticles();
  const { clients } = useClients();

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<CampaignFormData>({
    resolver: zodResolver(CampaignSchema),
    defaultValues: {
      codigo: '',
      machineId: '',
      articleId: '',
      clientId: '',
    }
  });

  // Observamos el cambio de cliente
  const selectedClientId = useWatch({
    control,
    name: 'clientId',
  });

  // Filtramos los artículos basados en el cliente seleccionado
  const filteredArticles = useMemo(() => {
    if (!selectedClientId) return [];
    return articles.filter(article => article.client?.id === selectedClientId);
  }, [articles, selectedClientId]);

  // Limpiamos el artículo seleccionado si cambiamos de cliente
  useEffect(() => {
    setValue('articleId', '');
  }, [selectedClientId, setValue]);

  const handleFormSubmit = async (data: CampaignFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Manejado por el hook
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputStyles = {
    disableUnderline: true,
    sx: {
      borderRadius: '8px 8px 0 0',
      backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : 'grey.100',
      '&:hover': {
        backgroundColor: isDark ? alpha(theme.palette.background.default, 0.8) : 'grey.200',
      },
      '&.Mui-focused': {
        backgroundColor: isDark ? theme.palette.background.default : 'grey.200',
      },
      '& .MuiFilledInput-input': {
        pt: '20px',
        pb: '8px',
        color: 'text.primary'
      },
      '& .MuiInputLabel-root': {
        color: 'text.secondary'
      }
    }
  };

  const sectionLabelStyles = {
    color: 'primary.main',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    mb: 2.5,
    display: 'block'
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: isDark ? '0 20px 70px rgba(0,0,0,0.5)' : '0 20px 70px rgba(0,0,0,0.08)',
          backgroundImage: 'none',
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box 
          sx={{ 
            py: 2.5, 
            px: 4,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : '#f4f8fb'
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              Iniciar Nueva Campaña
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'text.secondary' }}>
              Configuración de producción en línea
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.disabled' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ p: 4, px: 5, bgcolor: 'background.paper' }}>
          <Stack spacing={4}>
            {/* Sección de Identificación */}
            <Box>
              <Typography variant="caption" sx={sectionLabelStyles}>
                Identificación de Campaña
              </Typography>
              <Controller
                name="codigo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código de Campaña (Opcional)"
                    placeholder="CAMP-YYYYMMDD..."
                    fullWidth
                    variant="filled"
                    error={!!errors.codigo}
                    helperText={errors.codigo?.message}
                    disabled={isSubmitting}
                    InputProps={inputStyles}
                  />
                )}
              />
            </Box>

            {/* Sección de Configuración */}
            <Box>
              <Typography variant="caption" sx={sectionLabelStyles}>
                Configuración de Línea
              </Typography>
              <Stack spacing={2}>
                <Controller
                  name="machineId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Máquina / Línea de Producción"
                      fullWidth
                      variant="filled"
                      error={!!errors.machineId}
                      helperText={errors.machineId?.message}
                      disabled={isSubmitting}
                      InputProps={inputStyles}
                    >
                      {machines.map((m) => (
                        <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Cliente Solicitante"
                      fullWidth
                      variant="filled"
                      error={!!errors.clientId}
                      helperText={errors.clientId?.message}
                      disabled={isSubmitting}
                      InputProps={inputStyles}
                    >
                      {clients.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.commercialName}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="articleId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Artículo / Envase a Producir"
                      fullWidth
                      variant="filled"
                      error={!!errors.articleId}
                      helperText={errors.articleId?.message || (!selectedClientId ? "Seleccione primero un cliente" : "")}
                      disabled={isSubmitting || !selectedClientId}
                      InputProps={inputStyles}
                    >
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((a) => (
                          <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          <Typography variant="body2" color="text.secondary">
                            {selectedClientId ? "El cliente no tiene artículos registrados" : "Seleccione un cliente"}
                          </Typography>
                        </MenuItem>
                      )}
                    </TextField>
                  )}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 4, px: 5, bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting} sx={{ fontWeight: 600, textTransform: 'none', px: 3, color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            sx={{ 
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Iniciar Campaña'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
