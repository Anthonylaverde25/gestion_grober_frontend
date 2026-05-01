import { useState } from "react";
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
  CircularProgress,
  IconButton,
  Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useClients } from "@/app/features/production/hooks/useClients";
import { useArticles } from "@/app/features/articles/hooks/useArticles";
import { useCampaigns } from "@/app/features/production/hooks/useCampaigns";

interface StartCampaignModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine;
}

export default function StartCampaignModal({ open, onClose, machine }: StartCampaignModalProps) {
  const { clients, isLoading: loadingClients } = useClients();
  const { articles, isLoading: loadingArticles } = useArticles();
  const { startCampaign, isStarting } = useCampaigns();

  const [clientId, setClientId] = useState("");
  const [articleId, setArticleId] = useState("");

  const handleStart = async () => {
    if (!clientId || !articleId) return;
    
    try {
      await startCampaign({ machineId: machine.id, articleId, clientId });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px !important',
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
        square: true,
        sx: {
          borderRadius: '0px !important',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Box 
          sx={{ 
            py: 2, 
            px: 3,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid #cbd5e1',
            bgcolor: '#e2e8f0'
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Iniciar Nueva Campaña
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', fontSize: '10px', display: 'flex', alignItems: 'center', gap: 0.5, textTransform: 'uppercase' }}>
                <PrecisionManufacturingIcon sx={{ fontSize: 14 }} /> {machine.name} • Control de Apertura
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', borderRadius: '0px !important' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form>
        <DialogContent sx={{ p: 3, bgcolor: '#ffffff' }}>
          {loadingClients || loadingArticles ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={24} sx={{ color: '#475569' }} />
            </Box>
          ) : (
            <Stack spacing={4} sx={{ mt: 1 }}>
              <Box>
                  <Typography variant="caption" sx={sectionLabelStyles}>
                      <AssignmentIcon sx={{ fontSize: 16, color: '#475569' }} /> Configuración de Producción
                  </Typography>
                  <Stack direction="row" spacing={2}>
                      <TextField
                          select
                          label="Cliente / Propietario"
                          value={clientId}
                          onChange={(e) => setClientId(e.target.value)}
                          fullWidth
                          variant="outlined"
                          sx={inputStyles}
                      >
                          {clients.map((client) => (
                              <MenuItem key={client.id} value={client.id} sx={{ fontSize: '13px', fontWeight: 600 }}>
                                  {client.commercialName}
                              </MenuItem>
                          ))}
                      </TextField>

                      <TextField
                          select
                          label="Artículo / Envase"
                          value={articleId}
                          onChange={(e) => setArticleId(e.target.value)}
                          fullWidth
                          variant="outlined"
                          sx={inputStyles}
                      >
                          {articles.map((article) => (
                              <MenuItem key={article.id} value={article.id} sx={{ fontSize: '13px', fontWeight: 600 }}>
                                  {article.name}
                              </MenuItem>
                          ))}
                      </TextField>
                  </Stack>
              </Box>

              <Box sx={{ bgcolor: '#f8fafc', p: 2.5, borderLeft: '4px solid #334155' }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#1e293b', fontSize: '11px', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                      Protocolo de Seguridad y Calidad
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontSize: '12px', lineHeight: 1.6, fontWeight: 500 }}>
                      Al confirmar la apertura, el sistema vinculará la línea de producción al cliente seleccionado. Se iniciará el conteo de eficiencia en tiempo real y se generará un nuevo ID de campaña para el seguimiento de rendimiento.
                  </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
          <Button 
              onClick={onClose} 
              disabled={isStarting} 
              sx={{ 
                  color: '#64748b', 
                  fontWeight: 800, 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  borderRadius: '0px !important',
                  '&:hover': { bgcolor: 'transparent', color: '#0f172a' }
              }}
          >
            Descartar Operación
          </Button>
          <Button 
            onClick={handleStart} 
            variant="contained" 
            disabled={!clientId || !articleId || isStarting}
            sx={{ 
              borderRadius: '0px !important',
              px: 3,
              py: 1.2,
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
            startIcon={!isStarting && <PlayArrowIcon sx={{ fontSize: 18 }} />}
          >
            {isStarting ? <CircularProgress size={16} color="inherit" /> : "Iniciar Producción"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
