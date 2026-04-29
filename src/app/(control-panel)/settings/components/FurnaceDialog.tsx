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
  MenuItem
} from '@mui/material';
import { FurnaceSchema, FurnaceFormData } from '../schemas/FurnaceSchema';

interface FurnaceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FurnaceFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function FurnaceDialog({ open, onClose, onSubmit, isSubmitting }: FurnaceDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FurnaceFormData>({
    resolver: zodResolver(FurnaceSchema),
    defaultValues: {
      name: '',
      glassTypeId: 1,
      maxCapacityTons: 10
    }
  });

  const handleFormSubmit = async (data: FurnaceFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Horno</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Nombre del Horno"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="glassTypeId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Tipo de Vidrio"
                fullWidth
                error={!!errors.glassTypeId}
                helperText={errors.glassTypeId?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              >
                <MenuItem value={1}>Blanco (Flint)</MenuItem>
                <MenuItem value={2}>Ambar</MenuItem>
                <MenuItem value={3}>Verde</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="maxCapacityTons"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Capacidad Máxima (Toneladas)"
                fullWidth
                error={!!errors.maxCapacityTons}
                helperText={errors.maxCapacityTons?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
          >
            {isSubmitting ? 'Creando...' : 'Crear Horno'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
