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
  Typography,
} from "@mui/material";
import { Article } from "@/app/core/domain/entities/Article";
import { Machine } from "@/app/core/domain/entities/Machine";
import { z } from "zod";

const MachineArticleChangeSchema = z.object({
  articleId: z.string().nullable(),
});

type MachineArticleChangeFormData = z.infer<typeof MachineArticleChangeSchema>;

interface MachineArticleDialogProps {
  open: boolean;
  machine: Machine | null;
  articles: Article[];
  currentArticleName?: string;
  onClose: () => void;
  onSubmit: (articleId: string | null) => Promise<void>;
  isSubmitting: boolean;
}

export function MachineArticleDialog({
  open,
  machine,
  articles,
  currentArticleName,
  onClose,
  onSubmit,
  isSubmitting,
}: MachineArticleDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MachineArticleChangeFormData>({
    resolver: zodResolver(MachineArticleChangeSchema),
    values: {
      articleId: machine?.currentArticleId ?? null,
    },
  });

  const handleFormSubmit = async (data: MachineArticleChangeFormData) => {
    await onSubmit(data.articleId || null);
    reset({ articleId: data.articleId || null });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cambio de artículo</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="flex flex-col gap-4">
          <Typography color="text.secondary">
            Máquina seleccionada:{" "}
            <span className="font-semibold text-primary">
              {machine?.name || "-"}
            </span>
          </Typography>

          <Typography color="text.secondary">
            Artículo actual:{" "}
            <span className="font-semibold text-primary">
              {currentArticleName || "Sin artículo asignado"}
            </span>
          </Typography>

          <Controller
            name="articleId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Nuevo artículo"
                fullWidth
                value={field.value ?? ""}
                error={!!errors.articleId}
                helperText={errors.articleId?.message}
                disabled={isSubmitting}
                onChange={(event) => field.onChange(event.target.value || null)}
              >
                <MenuItem value="">Sin artículo asignado</MenuItem>
                {articles.map((article) => (
                  <MenuItem key={article.id} value={article.id}>
                    {article.name}
                  </MenuItem>
                ))}
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
            disabled={isSubmitting}
            startIcon={
              isSubmitting && <CircularProgress size={20} color="inherit" />
            }
          >
            {isSubmitting ? "Guardando..." : "Guardar cambio"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
