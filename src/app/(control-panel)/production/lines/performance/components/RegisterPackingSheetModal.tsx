import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Machine } from "@/app/core/domain/entities/Machine";
import { useServerTime } from "@/app/features/production/hooks/useServerTime";
import { useLineYield } from "@/app/features/production/hooks/useLineYield";
import EnterLegajoModal from "./EnterLegajoModal";

interface RegisterPackingSheetModalProps {
  open: boolean;
  onClose: () => void;
  machine: Machine;
}

export default function RegisterPackingSheetModal({
  open,
  onClose,
  machine,
}: RegisterPackingSheetModalProps) {
  const { serverTime, isLoading: isLoadingTime } = useServerTime();
  const { recordLineYieldBatch, isRecording } = useLineYield();

  const [rows, setRows] = useState(
    Array(6)
      .fill(null)
      .map((_, i) => ({
        id: i,
        formingYield: "",
        packingYield: "",
        notes: "",
      })),
  );

  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [batchMode, setBatchMode] = useState<{
    forming: boolean;
    packing: boolean;
  }>({
    forming: false,
    packing: false,
  });
  
  const [isLegajoModalOpen, setIsLegajoModalOpen] = useState(false);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const applyBatchValue = (
    field: "formingYield" | "packingYield",
    value: string,
  ) => {
    setRows(rows.map((row) => ({ ...row, [field]: value })));
    setBatchMode((prev) => ({
      ...prev,
      [field === "formingYield" ? "forming" : "packing"]: false,
    }));
  };

  // Cálculo de promedios
  const calculateAverage = (field: "formingYield" | "packingYield") => {
    const values = rows
      .map((row) => parseFloat(row[field]))
      .filter((val) => !isNaN(val));

    if (values.length === 0) return "0.00";
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(2);
  };

  const handleSaveClick = () => {
    setIsLegajoModalOpen(true);
  };

  const handleConfirmLegajo = async (aliasId: string | null) => {
    if (!machine.currentCampaignId || !serverTime) return;

    try {
      const yieldsToSave = rows
        .map((row, index) => {
          // La última fila (index 5) es la hora actual del server
          // Cada fila anterior resta 1 hora.
          const date = new Date(serverTime.timestamp * 1000);
          date.setHours(date.getHours() - (5 - index));
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);

          const fYield = parseFloat(row.formingYield);
          const pYield = parseFloat(row.packingYield);

          if (isNaN(fYield) && isNaN(pYield)) return null;

          return {
            forming_yield: isNaN(fYield) ? 0 : fYield,
            packing_yield: isNaN(pYield) ? 0 : pYield,
            recorded_at: date.toISOString(),
            notes: row.notes || undefined,
            user_alias_id: aliasId,
          };
        })
        .filter((y) => y !== null);

      if (yieldsToSave.length === 0) return;

      await recordLineYieldBatch({
        campaignId: machine.currentCampaignId,
        yields: yieldsToSave as any,
      });

      onClose();
      setIsLegajoModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isFormValid = rows.some(
    (row) =>
      (row.formingYield && !isNaN(parseFloat(row.formingYield))) ||
      (row.packingYield && !isNaN(parseFloat(row.packingYield))),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0 },
      }}
    >
      <DialogTitle sx={{ bgcolor: "#e2e8f0", py: 1.5, px: 3 }}>
        <Box className="flex justify-between items-center">
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Hoja de Registro de Rendimiento
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">
            grid_on
          </span>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Barra de Metadatos Minimalista */}
        <Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <Box className="flex gap-6">
            <span>
              Línea: <span className="text-on-surface">{machine.name}</span>
            </span>
            <span>
              Operador: <span className="text-on-surface">Juan Pérez</span>
            </span>
          </Box>
          <Box className="flex gap-6 text-right">
            <span>
              Hora Sincronización:{" "}
              <span className="text-primary">
                {isLoadingTime ? "Sincronizando..." : serverTime?.formatted}
              </span>
            </span>
            <span>
              Turno: <span className="text-on-surface">Matutino</span>
            </span>
          </Box>
        </Box>
        <Box className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-10">
                  #
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant w-24">
                  Hora
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant">
                  <Box className="flex items-center justify-between h-8">
                    {!batchMode.forming && <span>Forming Yield (%)</span>}
                    {batchMode.forming ? (
                      <TextField
                        placeholder="Set %"
                        variant="filled"
                        size="small"
                        autoFocus
                        fullWidth
                        onBlur={() =>
                          setBatchMode((prev) => ({ ...prev, forming: false }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            applyBatchValue(
                              "formingYield",
                              (e.target as HTMLInputElement).value,
                            );
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
                        onClick={() =>
                          setBatchMode((prev) => ({ ...prev, forming: true }))
                        }
                        sx={{ p: 0.5, color: "#94a3b8" }}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          bolt
                        </span>
                      </IconButton>
                    )}
                  </Box>
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase border-r border-outline-variant">
                  <Box className="flex items-center justify-between">
                    <span>Packing Yield (%)</span>
                    {/* 
                    {batchMode.packing ? (
                      <TextField
                        id="filled-basic"
                        label="Set %"
                        variant="filled"
                        size="small"
                        autoFocus
                        onBlur={() => setBatchMode(prev => ({ ...prev, packing: false }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') applyBatchValue("packingYield", (e.target as HTMLInputElement).value);
                        }}
                        sx={{ 
                          width: 80, 
                          '& .MuiInputBase-root': { height: 32, fontSize: '12px', bgcolor: 'white' },
                          '& .MuiInputLabel-root': { fontSize: '10px', mt: -1 }
                        }}
                      />
                    ) : (
                      <IconButton 
                        size="small" 
                        onClick={() => setBatchMode(prev => ({ ...prev, packing: true }))}
                        sx={{ p: 0.5, color: '#94a3b8' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                      </IconButton>
                    )}
                    */}
                  </Box>
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-bold text-on-surface-variant uppercase">
                  Notas / Observaciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                let displayHour = "--:--";
                if (serverTime) {
                  const date = new Date(serverTime.timestamp * 1000);
                  date.setHours(date.getHours() - (5 - index));
                  displayHour = `${date.getHours().toString().padStart(2, "0")}:00`;
                }

                return (
                  <tr
                    key={index}
                    className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-4 py-2 text-[12px] font-bold text-on-surface-variant bg-surface-container-low border-r border-outline-variant text-center font-data-tabular">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-[13px] font-bold text-primary border-r border-outline-variant text-center font-data-tabular bg-blue-50/30">
                      {isLoadingTime ? "..." : displayHour}
                    </td>
                    <td className="p-0 border-r border-outline-variant">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={row.formingYield}
                        disabled={isRecording}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "formingYield",
                            e.target.value,
                          )
                        }
                        className="w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors font-data-tabular font-bold text-center"
                      />
                    </td>
                    <td className="p-0 border-r border-outline-variant">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={row.packingYield}
                        disabled={isRecording}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "packingYield",
                            e.target.value,
                          )
                        }
                        className="w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors font-data-tabular font-bold text-center"
                      />
                    </td>
                    <td className="p-0">
                      <input
                        type="text"
                        placeholder="Notas..."
                        value={row.notes}
                        disabled={isRecording}
                        onChange={(e) =>
                          handleInputChange(index, "notes", e.target.value)
                        }
                        className="w-full h-11 px-4 text-[13px] bg-transparent border-none outline-none focus:bg-primary-container/10 transition-colors"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-b border-outline-variant">
                <td
                  colSpan={2}
                  className="px-4 py-2 text-right text-[11px] uppercase text-on-surface-variant border-r border-outline-variant"
                >
                  Promedios:
                </td>
                <td className="px-4 py-2 text-center text-primary font-data-tabular text-[14px] border-r border-outline-variant">
                  {calculateAverage("formingYield")}%
                </td>
                <td className="px-4 py-2 text-center text-primary font-data-tabular text-[14px] border-r border-outline-variant">
                  {calculateAverage("packingYield")}%
                </td>
                <td className="bg-slate-50 border-none"></td>
              </tr>
            </tfoot>
          </table>
        </Box>

        {/* Área de Carga de Evidencia */}
        <Box className="p-4 bg-surface-container-lowest border-t border-outline-variant">
          <Box className="flex items-center justify-between mb-2">
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#475569",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              Evidencia de Hoja Física
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showEvidence}
                  onChange={(e) => setShowEvidence(e.target.checked)}
                  sx={{
                    color: "#94a3b8",
                    "&.Mui-checked": { color: "#334155" },
                  }}
                />
              }
              label={
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                >
                  Habilitar Carga
                </Typography>
              }
              sx={{ m: 0 }}
            />
          </Box>

          {showEvidence && (
            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-none transition-all cursor-pointer ${evidenceImage ? "border-success bg-success/5" : "border-outline-variant hover:border-primary hover:bg-primary/5"}`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isRecording}
                onChange={(e) => setEvidenceImage(e.target.files?.[0] || null)}
              />

              {evidenceImage ? (
                <Box className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-success text-3xl">
                    check_circle
                  </span>
                  <Typography
                    variant="body2"
                    className="text-success font-bold uppercase text-[11px]"
                  >
                    Imagen cargada: {evidenceImage.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-on-surface-variant"
                  >
                    Haz clic para cambiar la imagen
                  </Typography>
                </Box>
              ) : (
                <Box className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-3xl">
                    add_a_photo
                  </span>
                  <Typography
                    variant="body2"
                    className="text-on-surface-variant font-bold uppercase text-[11px]"
                  >
                    Cargar foto de la hoja física
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-on-surface-variant"
                  >
                    Formatos permitidos: JPG, PNG • Máx 5MB
                  </Typography>
                </Box>
              )}
            </label>
          )}
        </Box>

        <Box className="p-4 bg-slate-50 flex items-center gap-2 border-t border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            info
          </span>
          <Typography
            variant="caption"
            className="text-on-surface-variant italic"
          >
            La foto es opcional, pero recomendada para corroborar la
            trazabilidad de los datos cargados en serie.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          px: 3,
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isRecording}
          sx={{
            color: "#64748b",
            fontWeight: 800,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            borderRadius: 0,
          }}
        >
          Descartar
        </Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={!isFormValid || isLoadingTime || isRecording}
          sx={{
            borderRadius: 0,
            px: 4,
            py: 1,
            bgcolor: "#334155",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1e293b",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#e2e8f0",
              color: "#94a3b8",
            },
          }}
        >
          {isRecording ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Confirmar y Guardar Todo"
          )}
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
