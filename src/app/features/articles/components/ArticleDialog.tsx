import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress
} from '@mui/material';
import { ArticleSchema, ArticleFormData } from '../schemas/ArticleSchema';

interface ArticleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ArticleDialog({ open, onClose, onSubmit, isSubmitting }: ArticleDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      name: ''
    }
  });

  const handleFormSubmit = async (data: ArticleFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // El error ya es manejado por el hook useArticles
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nuevo Artículo</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Nombre del Artículo"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
          >
            {isSubmitting ? 'Creando...' : 'Crear Artículo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
