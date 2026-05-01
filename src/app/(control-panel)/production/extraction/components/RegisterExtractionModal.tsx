import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ArticleIcon from "@mui/icons-material/Article";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useExtractionHistory } from "@/app/features/extraction/hooks/useExtractionHistory";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const { registerExtraction, isRegistering } = useExtractionHistory(
    machine.id,
  );
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
      enqueueSnackbar("El porcentaje debe estar entre 0 y 100", {
        variant: "error",
      });
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

      enqueueSnackbar("Extracción registrada correctamente", {
        variant: "success",
      });
      onClose();
    } catch (error) {
      enqueueSnackbar("Error al registrar la extracción", { variant: "error" });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        },
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "primary.contrastText"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box 
              sx={{ 
                mr: 2, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "14px",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)"
              }}
            >
              <SensorsIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                Registrar Medición
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500, display: "flex", alignItems: "center", mt: 0.5 }}>
                <PrecisionManufacturingIcon sx={{ fontSize: 14, mr: 0.5 }} /> {machine.name}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "inherit", opacity: 0.7, "&:hover": { opacity: 1 } }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 4 }}>
          <Box>
            <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
              Estado Actual
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main", mr: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Operativo</Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
              Referencia Temporal
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: "primary.main" }} />
              {format(currentTime, "HH:mm:ss")}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: "span 2" }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", bgcolor: "grey.50", borderStyle: "dashed" }}>
              <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 0.5 }}>
                Artículo en Proceso
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArticleIcon sx={{ mr: 1, color: "secondary.main" }} />
                <Typography variant="body1" sx={{ fontWeight: 700, color: "secondary.dark" }}>
                  {machine.currentArticleName}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        <Box
          sx={{
            background: (theme) => `linear-gradient(to bottom, ${theme.palette.grey[50]}, #ffffff)`,
            p: 4,
            borderRadius: "20px",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: "0.1em",
              mb: 2
            }}
          >
            PORCENTAJE DE EXTRACCIÓN
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <TextField
              variant="standard"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              autoFocus
              placeholder="00.0"
              disabled={isRegistering}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "72px",
                  fontWeight: 900,
                  color: "primary.dark",
                  fontFamily: "var(--fuse-font-family)",
                  "& input": {
                    textAlign: "center",
                    p: 0,
                    width: "200px",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  },
                },
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, color: "secondary.main", opacity: 0.5 }}>
              %
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ mt: 2, color: "text.disabled", fontWeight: 600 }}>
            {format(currentTime, "EEEE, dd 'de' MMMM", { locale: es })}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isRegistering}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="secondary"
          disabled={isRegistering || !percentage}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            px: 4,
            fontWeight: 800,
            fontSize: 14,
            boxShadow: (theme) => `0 10px 20px -5px ${theme.palette.secondary.main}40`,
            "&:hover": {
              boxShadow: (theme) => `0 12px 25px -5px ${theme.palette.secondary.main}60`,
            }
          }}
          startIcon={
            isRegistering ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CheckCircleIcon />
            )
          }
        >
          {isRegistering ? "PROCESANDO..." : "CONFIRMAR REGISTRO"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
