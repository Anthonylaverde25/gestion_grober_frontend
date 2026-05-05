import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import IdentificationIcon from '@mui/icons-material/Badge';
import { useUserAliases } from '../../api/hooks/team/useUserAliases';
import { SettingsTeamMember } from '../../types';

interface ViewAliasesDialogProps {
  open: boolean;
  onClose: () => void;
  member: SettingsTeamMember | null;
}

export function ViewAliasesDialog({ open, onClose, member }: ViewAliasesDialogProps) {
  const { aliases, isLoading } = useUserAliases(member ? parseInt(member.id) : undefined);

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
      fullWidth 
      maxWidth="md"
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
            Alias Registrados
          </Typography>
          <IdentificationIcon sx={{ color: '#0070f2', fontSize: '20px' }} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Barra de Metadatos Minimalista */}
        <Box className="px-6 py-2 bg-slate-50 border-b border-outline-variant flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <Box className="flex gap-4">
            <span>Terminal: <span className="text-on-surface">{member?.name || 'Cargando...'}</span></span>
          </Box>
          <Box className="flex gap-4 text-right">
            <span>Total Alias: <span className="text-primary">{aliases.length}</span></span>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="caption" sx={sectionLabelStyles}>
            Listado de Operarios Vinculados
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : aliases.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                No hay alias registrados para este usuario.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ border: '1px solid #e2e8f0' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#475569' }}>Nombre del Operario</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#475569' }}>Legajo</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#475569' }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aliases.map((alias) => (
                    <TableRow key={alias.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{alias.name}</TableCell>
                      <TableCell sx={{ fontSize: '13px', fontWeight: 700, color: '#0070f2', fontFamily: 'monospace' }}>{alias.legajo}</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Activo</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, px: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#64748b', 
            fontWeight: 800, 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            borderRadius: 0,
            ml: 'auto',
            '&:hover': { bgcolor: 'transparent', color: '#0f172a' }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
