import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Furnace } from "@/app/core/domain/entities/Furnace";
import { MachineFormData, MachineSchema } from "../schemas/MachineSchema";

interface MachineDialogProps {
  open: boolean;
  furnaces: Furnace[];
  onClose: () => void;
  onSubmit: (data: MachineFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function MachineDialog({
  open,
  furnaces,
  onClose,
  onSubmit,
  isSubmitting,
}: MachineDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MachineFormData>({
    resolver: zodResolver(MachineSchema),
    defaultValues: {
      furnaceId: furnaces[0]?.id ?? "",
      name: "",
      status: "operational",
    },
  });

  useEffect(() => {
    if (furnaces.length > 0) {
      setValue("furnaceId", furnaces[0].id);
    }
  }, [furnaces, setValue]);

  const handleFormSubmit = async (data: MachineFormData) => {
    try {
      await onSubmit(data);
      reset({
        furnaceId: furnaces[0]?.id ?? "",
        name: "",
        status: "operational",
      });
      onClose();
    } catch (error) {
      return;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Nueva Máquina</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                label="Nombre de la Máquina"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="furnaceId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Horno Asociado"
                fullWidth
                error={!!errors.furnaceId}
                helperText={
                  errors.furnaceId?.message ||
                  (furnaces.length === 0
                    ? "No hay hornos disponibles para asociar"
                    : undefined)
                }
                disabled={isSubmitting || furnaces.length === 0}
              >
                {furnaces.map((furnace) => (
                  <MenuItem key={furnace.id} value={furnace.id}>
                    {furnace.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Estado Operativo"
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}
                disabled={isSubmitting}
              >
                <MenuItem value="operational">Operativa</MenuItem>
                <MenuItem value="maintenance">Mantenimiento</MenuItem>
                <MenuItem value="shutdown">Detenida</MenuItem>
              </TextField>
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
            disabled={isSubmitting || furnaces.length === 0}
            startIcon={
              isSubmitting && <CircularProgress size={20} color="inherit" />
            }
          >
            {isSubmitting ? "Creando..." : "Crear Máquina"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
