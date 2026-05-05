import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  CircularProgress,
  Tooltip,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import BoltIcon from "@mui/icons-material/Bolt";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useLineYield } from "@/app/features/production/hooks/useLineYield";
import { useServerTime } from "@/app/features/production/hooks/useServerTime";
import EnterLegajoModal from "./EnterLegajoModal";

interface RegisterLineYieldModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine;
}

interface YieldRow {
  id: string;
  formingYield: string;
  packingYield: string;
  recordedAt: string;
  notes: string;
}

export default function RegisterLineYieldModal({ open, onClose, machine }: RegisterLineYieldModalProps) {
  const { recordLineYieldBatch, isRecording } = useLineYield();
  const { serverTime, isLoading: isLoadingTime } = useServerTime();

  const [rows, setRows] = useState<YieldRow[]>([]);
  const [isLegajoModalOpen, setIsLegajoModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState<{ forming: boolean; packing: boolean }>({
    forming: false,
    packing: false,
  });

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Inicializar con una fila cuando se abre el modal y el tiempo está listo
  useEffect(() => {
    if (open && serverTime && rows.length === 0) {
      addInitialRow();
    }
  }, [open, serverTime]);

  const addInitialRow = () => {
    if (!serverTime) return;
    const now = new Date(serverTime.timestamp * 1000);

    setRows([{
      id: crypto.randomUUID(),
      formingYield: "",
      packingYield: "",
      recordedAt: formatDateTimeLocal(now),
      notes: ""
    }]);
  };

  const handleAddRow = () => {
    let newTime = "";
    if (rows.length > 0) {
      newTime = rows[rows.length - 1].recordedAt;
    } else if (serverTime) {
      newTime = formatDateTimeLocal(new Date(serverTime.timestamp * 1000));
    }

    setRows([...rows, {
      id: crypto.randomUUID(),
      formingYield: "",
      packingYield: "",
      recordedAt: newTime,
      notes: ""
    }]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter(row => row.id !== id));
  };

  const handleInputChange = (id: string, field: keyof YieldRow, value: string) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const applyBatchValue = (field: "formingYield" | "packingYield", value: string) => {
    setRows(rows.map((row) => ({ ...row, [field]: value })));
    setBatchMode((prev) => ({
      ...prev,
      [field === "formingYield" ? "forming" : "packing"]: false,
    }));
  };

  const handleSaveClick = () => {
    setIsLegajoModalOpen(true);
  };

  const handleConfirmLegajo = async (aliasId: string | null) => {
    if (!machine.currentCampaignId || !serverTime) return;

    try {
      const yieldsToSave = rows
        .map(row => {
          const fYield = parseFloat(row.formingYield);
          const pYield = parseFloat(row.packingYield);

          if (isNaN(fYield) && isNaN(pYield)) return null;

          const date = new Date(row.recordedAt);

          return {
            formingYield: isNaN(fYield) ? 0 : fYield,
            packingYield: isNaN(pYield) ? 0 : pYield,
            recordedAt: date.toISOString(),
            notes: row.notes || undefined,
            userAliasId: aliasId,
          };
        })
        .filter((y): y is NonNullable<typeof y> => y !== null);

      if (yieldsToSave.length === 0) return;

      await recordLineYieldBatch({
        campaignId: machine.currentCampaignId,
        yields: yieldsToSave,
      });

      onClose();
      setIsLegajoModalOpen(false);
      setRows([]); // Reset
    } catch (error) {
      console.error(error);
    }
  };

  const isRowValid = (row: YieldRow) => {
    const f = parseFloat(row.formingYield);
    const p = parseFloat(row.packingYield);
    return (
      row.formingYield !== "" && !isNaN(f) && f >= 0 && f <= 100 &&
      row.packingYield !== "" && !isNaN(p) && p >= 0 && p <= 100
    );
  };

  const isFormValid = rows.length > 0 && rows.every(isRowValid);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '1035px', // Aproximadamente un 15% más que el 'md' estándar de 900px
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: "#e2e8f0", py: 1.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Hoja de Registro de Rendimiento
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">grid_on</span>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Barra de Metadatos Minimalista */}
        <Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <Box className="flex gap-4">
            <span>Línea: <span className="text-on-surface">{machine.name}</span></span>
            <span>Ref: <span className="text-on-surface font-data-tabular">{machine.id.split('-')[0]}</span></span>
          </Box>

        </Box>

        <Box className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-2 text-center text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-10">
                  #
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-44">
                  <Box className="flex items-center gap-1">
                    <HistoryToggleOffIcon sx={{ fontSize: 14 }} /> Fecha y Hora
                  </Box>
                </th>
                <th className="px-4 py-2 text-center text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-40">
                  <Box className="flex items-center justify-between h-8">
                    {!batchMode.forming && <span>Forming Yield (%)</span>}
                    {batchMode.forming ? (
                      <TextField
                        placeholder="Set %"
                        variant="filled"
                        size="small"
                        autoFocus
                        fullWidth
                        onBlur={() => setBatchMode((prev) => ({ ...prev, forming: false }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            applyBatchValue("formingYield", (e.target as HTMLInputElement).value);
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 32,
                            fontSize: "12px",
                            bgcolor: "white",
                            borderRadius: 0,
                          },
                          "& .MuiInputBase-input": { p: "0 12px" },
                        }}
                      />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => setBatchMode((prev) => ({ ...prev, forming: true }))}
                        sx={{ p: 0.5, color: "#94a3b8" }}
                      >
                        <BoltIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </th>
                <th className="px-4 py-2 text-center text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-40">
                  <Box className="flex items-center justify-between h-8">
                    {!batchMode.packing && <span>Packing Yield (%)</span>}
                    {batchMode.packing ? (
                      <TextField
                        placeholder="Set %"
                        variant="filled"
                        size="small"
                        autoFocus
                        fullWidth
                        onBlur={() => setBatchMode((prev) => ({ ...prev, packing: false }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            applyBatchValue("packingYield", (e.target as HTMLInputElement).value);
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            height: 32,
                            fontSize: "12px",
                            bgcolor: "white",
                            borderRadius: 0,
                          },
                          "& .MuiInputBase-input": { p: "0 12px" },
                        }}
                      />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => setBatchMode((prev) => ({ ...prev, packing: true }))}
                        sx={{ p: 0.5, color: "#94a3b8" }}
                      >
                        <BoltIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-64">
                  Notas / Observaciones
                </th>
                <th className="px-2 py-2 text-center text-[11px] font-bold text-on-surface-variant uppercase w-10">
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-outline-variant hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2 text-[12px] font-bold text-slate-400 border-r border-outline-variant text-center font-data-tabular bg-slate-50/30">
                    {index + 1}
                  </td>
                  <td className="p-0 border-r border-outline-variant">
                    <input
                      type="datetime-local"
                      value={row.recordedAt}
                      onChange={(e) => handleInputChange(row.id, "recordedAt", e.target.value)}
                      className="w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors font-data-tabular font-bold text-primary"
                    />
                  </td>
                  <td className={`p-0 border-r border-outline-variant ${row.formingYield !== "" && (parseFloat(row.formingYield) < 0 || parseFloat(row.formingYield) > 100) ? 'bg-red-50' : ''}`}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.formingYield}
                      onChange={(e) => handleInputChange(row.id, "formingYield", e.target.value)}
                      className={`w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors font-data-tabular font-bold text-center ${row.formingYield !== "" && (parseFloat(row.formingYield) < 0 || parseFloat(row.formingYield) > 100) ? 'text-red-600' : ''}`}
                    />
                  </td>
                  <td className={`p-0 border-r border-outline-variant ${row.packingYield !== "" && (parseFloat(row.packingYield) < 0 || parseFloat(row.packingYield) > 100) ? 'bg-red-50' : ''}`}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.packingYield}
                      onChange={(e) => handleInputChange(row.id, "packingYield", e.target.value)}
                      className={`w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors font-data-tabular font-bold text-center ${row.packingYield !== "" && (parseFloat(row.packingYield) < 0 || parseFloat(row.packingYield) > 100) ? 'text-red-600' : ''}`}
                    />
                  </td>
                  <td className="p-0 border-r border-outline-variant">
                    <input
                      type="text"
                      placeholder="Notas de producción..."
                      value={row.notes}
                      onChange={(e) => handleInputChange(row.id, "notes", e.target.value)}
                      className="w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors"
                    />
                  </td>
                  <td className="px-2 py-0 text-center">
                    {rows.length > 1 && (
                      <Tooltip title="Eliminar fila">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveRow(row.id)}
                          sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box className="p-4 flex justify-start">
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{
              color: '#64748b',
              fontWeight: 800,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' }
            }}
          >
            Agregar nueva línea
          </Button>
        </Box>
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
          onClick={handleSaveClick}
          variant="contained"
          disabled={!isFormValid || isRecording || isLoadingTime}
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
          {isRecording ? <CircularProgress size={16} color="inherit" /> : "Confirmar y Guardar Lote"}
        </Button>
      </DialogActions>

      <EnterLegajoModal
        open={isLegajoModalOpen}
        onClose={() => setIsLegajoModalOpen(false)}
        onConfirm={handleConfirmLegajo}
        isSaving={isRecording}
      />
    </Dialog>
  );
}
