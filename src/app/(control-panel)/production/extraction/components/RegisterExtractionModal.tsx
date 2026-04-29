import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useExtractionHistory } from "@/app/features/extraction/hooks/useExtractionHistory";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

interface RegisterExtractionModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine;
}

export default function RegisterExtractionModal({
  open,
  onClose,
  machine,
}: RegisterExtractionModalProps) {
  const [percentage, setPercentage] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { registerExtraction, isRegistering } = useExtractionHistory(machine.id);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setPercentage("");
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [open]);

  const handleSave = async () => {
    const value = parseFloat(percentage);

    if (isNaN(value) || value < 0 || value > 100) {
      enqueueSnackbar("El porcentaje debe estar entre 0 y 100", { variant: "error" });
      return;
    }

    try {
      await registerExtraction({
        machineId: machine.id,
        articleId: machine.currentArticleId || "",
        articleName: machine.currentArticleName,
        percentage: value,
        measuredAt: currentTime,
        isActive: true,
      });

      enqueueSnackbar("Extracción registrada correctamente", { variant: "success" });
      onClose();
    } catch (error) {
      enqueueSnackbar("Error al registrar la extracción", { variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        className: "rounded-none border border-outline-variant shadow-2xl",
        sx: {
          backgroundImage: 'none',
          maxWidth: '640px', // Increased width as requested
          width: '100%'
        }
      }}
    >
      <DialogTitle className="flex items-center justify-between bg-surface-container-low px-gutter py-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">add_notes</span>
          </div>
          <div>
            <Typography className="text-[16px] font-bold text-on-surface leading-tight">
              Registrar Extracción de Producción
            </Typography>
            <Typography className="text-[12px] text-on-surface-variant font-medium">
              Unidad Operativa: <span className="text-on-surface font-bold">{machine.name}</span>
            </Typography>
          </div>
        </div>
        <IconButton onClick={onClose} size="small" className="text-on-surface-variant">
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>

      <DialogContent className="pt-8 pb-4 flex flex-col gap-6 px-gutter">
        {/* Context Info Stacked Vertically */}
        <div className="flex flex-col gap-3">
          {/* Shift Supervisor (Static for now) */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Typography className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Jefe de Turno (Autorizante)
              </Typography>
              <Typography className="text-[14px] font-bold text-on-surface">
                Ing. Roberto Quiroz
              </Typography>
            </div>
            <div className="px-2 py-1 bg-primary/5 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase">
              Sesión Activa
            </div>
          </div>

          {/* Current Article */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-1">
            <Typography className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Artículo en Producción
            </Typography>
            <Typography className="text-[15px] font-semibold text-on-surface">
              {machine.currentArticleName}
            </Typography>
          </div>

          {/* Date and Time */}
          <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-1">
            <Typography className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Timestamp del Registro
            </Typography>
            <Typography className="text-[15px] font-semibold text-primary font-data-tabular">
              {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy - HH:mm:ss")}
            </Typography>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2 bg-surface-container-low p-6 border border-outline-variant">
          <Typography className="text-[12px] font-bold text-center text-on-surface-variant uppercase tracking-widest">
            VALOR DE MEDICIÓN ACTUAL
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            autoFocus
            placeholder="00.00"
            slotProps={{
              input: {
                className: "font-data-tabular text-5xl font-black py-4",
                disableUnderline: true,
                endAdornment: <Typography variant="h3" className="text-primary font-black ml-2">%</Typography>,
                sx: {
                  '& input': {
                    textAlign: 'center',
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      '-webkit-appearance': 'none',
                      margin: 0,
                    },
                  }
                }
              }
            }}
            disabled={isRegistering}
          />
          <Typography className="text-[11px] text-center text-on-surface-variant font-medium">
            Ingrese el porcentaje exacto reportado por el sistema de control.
          </Typography>
        </div>
      </DialogContent>

      <DialogActions className="px-gutter pb-8 pt-4 flex gap-4">
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          className="font-bold text-[13px] h-11 px-8 rounded-none border-outline-variant"
          disabled={isRegistering}
        >
          DESCARTAR
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          className="font-bold text-[13px] h-11 rounded-none shadow-none"
          disabled={isRegistering || !percentage}
          startIcon={isRegistering ? <CircularProgress size={18} color="inherit" /> : <span className="material-symbols-outlined">verified</span>}
        >
          {isRegistering ? "PROCESANDO..." : "CONFIRMAR Y REGISTRAR"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
