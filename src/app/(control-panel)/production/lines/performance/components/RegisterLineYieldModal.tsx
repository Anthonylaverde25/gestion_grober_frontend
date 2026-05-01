import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useLineYield } from "@/app/features/production/hooks/useLineYield";
import { useCampaigns } from "@/app/features/production/hooks/useCampaigns";

interface RegisterLineYieldModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine;
}

export default function RegisterLineYieldModal({ open, onClose, machine }: RegisterLineYieldModalProps) {
  const { recordLineYield, isRecording } = useLineYield();
  const { finishCampaign, isFinishing } = useCampaigns();

  const [formingYield, setFormingYield] = useState<string>("");
  const [packingYield, setPackingYield] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!machine.currentCampaignId) return;

    try {
      await recordLineYield({
        campaignId: machine.currentCampaignId,
        formingYield: formingYield ? parseFloat(formingYield) : undefined,
        packingYield: packingYield ? parseFloat(packingYield) : undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: '#e2e8f0',
      },
      '&:hover fieldset': {
        borderColor: '#94a3b8',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#475569',
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '14px',
      fontWeight: 600,
    },
    '& .MuiInputLabel-root': {
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#64748b'
    }
  };

  const sectionLabelStyles = {
    color: '#0f172a',
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
        bgcolor: '#f1f5f9'
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
          borderRadius: 0,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: "#e2e8f0", py: 1.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Registro de Rendimiento
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">precision_manufacturing</span>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Barra de Metadatos Minimalista */}
        <Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <Box className="flex gap-4">
            <span>Línea: <span className="text-on-surface">{machine.name}</span></span>
            <span>Ref: <span className="text-on-surface font-data-tabular">{machine.id.split('-')[0]}</span></span>
          </Box>
          <Box className="flex gap-4 text-right">
            <span>Operador: <span className="text-on-surface">Juan Pérez</span></span>
          </Box>
        </Box>

        <Stack spacing={3.5} sx={{ p: 3, mt: 1 }}>
          {/* Eficiencia de Línea */}
          <Box>
            <Typography variant="caption" sx={sectionLabelStyles}>
              <PrecisionManufacturingIcon sx={{ fontSize: 16, color: '#475569' }} /> Eficiencia de Proceso
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Forming Yield"
                    type="number"
                    value={formingYield}
                    onChange={(e) => setFormingYield(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="0.00"
                    InputProps={{
                        endAdornment: <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8' }}>%</Typography>,
                    }}
                    sx={inputStyles}
                />
                <TextField
                    label="Packing Yield"
                    type="number"
                    value={packingYield}
                    onChange={(e) => setPackingYield(e.target.value)}
                    fullWidth
                    variant="outlined"
                    placeholder="0.00"
                    InputProps={{
                        endAdornment: <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8' }}>%</Typography>,
                    }}
                    sx={inputStyles}
                />
            </Stack>
          </Box>

          {/* Observaciones */}
          <Box>
            <Typography variant="caption" sx={sectionLabelStyles}>
              Notas de Producción
            </Typography>
            <TextField
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Describa anomalías o eventos de merma..."
              sx={{
                ...inputStyles,
                '& .MuiInputBase-input': {
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: 500
                }
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
        <Button 
            onClick={onClose} 
            disabled={isRecording} 
            sx={{ 
                color: '#64748b', 
                fontWeight: 800, 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderRadius: 0,
                '&:hover': { bgcolor: 'transparent', color: '#0f172a' }
            }}
        >
          Descartar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={(!formingYield && !packingYield) || isRecording}
          sx={{ 
            borderRadius: 0,
            px: 3,
            py: 1,
            bgcolor: '#334155',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#1e293b',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8'
            }
          }}
        >
          {isRecording ? <CircularProgress size={16} color="inherit" /> : "Confirmar Registro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
