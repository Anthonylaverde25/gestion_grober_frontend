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
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          border: "1px solid #cbd5e1",
          backgroundImage: "none",
          maxWidth: "580px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      {/* Header Fiori Style - Simplified */}
      <DialogTitle
        sx={{
          p: 0,
          backgroundColor: "#fff",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
            px: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 0.5,
              }}
            >
              PRODUCCIÓN / EXTRACCIÓN
            </Typography>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}
            >
              Registrar Nueva Medición
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#cbd5e1" }}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}
      >
        {/* Contextual Data Grid */}
        <Box
          className="mt-2"
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Unidad Operativa
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}
            >
              {machine.name}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Jefe de Turno
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "#475569" }}
            >
              Ing. Roberto Quiroz
            </Typography>
          </Box>
          <Box sx={{ gridColumn: "span 2" }}>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Artículo en Proceso
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 700, color: "#0058c2" }}
            >
              {machine.currentArticleName}
            </Typography>
          </Box>
          <Box sx={{ gridColumn: "span 2" }}>
            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Timestamp de Operación
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              {format(currentTime, "EEEE, dd 'de' MMMM, yyyy - HH:mm:ss")}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#f1f5f9" }} />

        {/* Input Area */}
        <Box
          sx={{
            backgroundColor: "#f1f5f9",
            p: 4,
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
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
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "#0f172a",
                  fontFamily: "monospace",
                  "& input": {
                    textAlign: "center",
                    p: 0,
                    width: "180px",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                      {
                        "-webkit-appearance": "none",
                        margin: 0,
                      },
                  },
                },
              }}
            />
            <Typography
              sx={{ fontSize: 32, fontWeight: 900, color: "#0058c2" }}
            >
              %
            </Typography>
          </Box>

          <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
            Ingrese el valor reportado por el sensor de línea
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, borderTop: "1px solid #f1f5f9" }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#64748b",
            fontWeight: 700,
            fontSize: 12,
            px: 3,
            "&:hover": { backgroundColor: "#f8fafc" },
          }}
          disabled={isRegistering}
        >
          CANCELAR
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          fullWidth
          disabled={isRegistering || !percentage}
          sx={{
            backgroundColor: "#0f172a",
            color: "#fff",
            borderRadius: 0,
            py: 1.5,
            fontWeight: 700,
            fontSize: 13,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1e293b", boxShadow: "none" },
            "&.Mui-disabled": { backgroundColor: "#e2e8f0", color: "#94a3b8" },
          }}
          startIcon={
            isRegistering ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Icon sx={{ fontSize: "18px !important" }}>check_circle</Icon>
            )
          }
        >
          {isRegistering ? "PROCESANDO..." : "CONFIRMAR REGISTRO"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
