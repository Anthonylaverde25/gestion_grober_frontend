import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserAlias, UserAlias } from "@/app/features/production/hooks/useUserAlias";
import useSession from "@/hooks/useSession";

interface EnterLegajoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (aliasId: string | null) => void;
  isSaving?: boolean;
}

export default function EnterLegajoModal({
  open,
  onClose,
  onConfirm,
  isSaving = false,
}: EnterLegajoModalProps) {
  const { user } = useSession();
  const { searchAlias, isSearching } = useUserAlias();
  
  const [legajo, setLegajo] = useState("");
  const [alias, setAlias] = useState<UserAlias | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user has admin privileges to skip legajo
  const userRoles = Array.isArray(user?.role) ? user.role : [user?.role];
  const isAdmin = userRoles.some((role: any) => 
    ["super-admin", "admin", "owner", "company-manager"].includes(role)
  );

  const handleSearch = async () => {
    if (!legajo.trim()) return;
    
    setError(null);
    setAlias(null);
    
    try {
      const result = await searchAlias(legajo.trim());
      setAlias(result);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Legajo no encontrado.");
      } else {
        setError("Error al buscar el legajo.");
      }
    }
  };

  const handleConfirm = () => {
    if (alias) {
      onConfirm(alias.id);
    }
  };

  const handleSkip = () => {
    onConfirm(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
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
            Identificación Requerida
          </Typography>
          <span className="material-symbols-outlined text-primary text-[20px]">
            badge
          </span>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4, bgcolor: "#f8fafc" }}>
        <Typography variant="body2" sx={{ mb: 3, color: "#475569" }}>
          Ingrese su número de legajo para validar su identidad y asociarla con este registro de producción.
        </Typography>

        <Box className="flex gap-2 mb-2">
          <TextField
            fullWidth
            label="Número de Legajo"
            variant="outlined"
            size="small"
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            error={!!error}
            disabled={isSearching || isSaving}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                borderRadius: 0,
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!legajo.trim() || isSearching || isSaving}
            sx={{
              borderRadius: 0,
              bgcolor: "#334155",
              minWidth: "100px",
              "&:hover": { bgcolor: "#1e293b" }
            }}
          >
            {isSearching ? <CircularProgress size={20} color="inherit" /> : "Buscar"}
          </Button>
        </Box>
        
        {error && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 1, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {alias && (
          <Box className="mt-4 p-3 bg-blue-50 border border-blue-200 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600">check_circle</span>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", textTransform: "uppercase", fontWeight: 700, fontSize: "10px" }}>
                Usuario Verificado
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>
                {alias.name}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          px: 3,
          bgcolor: "#f1f5f9",
          borderTop: "1px solid #e2e8f0",
          justifyContent: isAdmin ? "space-between" : "flex-end"
        }}
      >
        {isAdmin && (
          <Button
            onClick={handleSkip}
            disabled={isSaving}
            sx={{
              color: "#64748b",
              fontWeight: 800,
              fontSize: "11px",
              textTransform: "uppercase",
              borderRadius: 0,
            }}
          >
            Omitir (Admin)
          </Button>
        )}
        
        <Box className="flex gap-2">
          <Button
            onClick={onClose}
            disabled={isSaving}
            sx={{
              color: "#64748b",
              fontWeight: 800,
              fontSize: "11px",
              textTransform: "uppercase",
              borderRadius: 0,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!alias || isSaving}
            sx={{
              borderRadius: 0,
              bgcolor: "#0f172a",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "11px",
              textTransform: "uppercase",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#000000",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "#cbd5e1",
                color: "#94a3b8",
              },
            }}
          >
            {isSaving ? <CircularProgress size={16} color="inherit" /> : "Confirmar"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
