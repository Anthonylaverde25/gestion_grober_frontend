import { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import IdentificationIcon from '@mui/icons-material/Badge';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { useUserAliases } from '../../api/hooks/team/useUserAliases';
import { SettingsTeamMember } from '../../types';
import { UserAlias } from '@/app/core/domain/entities/UserAlias';

interface ViewAliasesDialogProps {
  open: boolean;
  onClose: () => void;
  member: SettingsTeamMember | null;
  onAddAlias?: (member: SettingsTeamMember) => void;
}

export function ViewAliasesDialog({ open, onClose, member, onAddAlias }: ViewAliasesDialogProps) {
  const { aliases, isLoading } = useUserAliases(member ? parseInt(member.id) : undefined);

  const columns = useMemo<MRT_ColumnDef<UserAlias>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre del Operario',
        size: 200,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'legajo',
        header: 'Legajo',
        size: 60,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#0070f2', fontFamily: 'monospace' }}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        size: 70,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<boolean>() ? 'ACTIVO' : 'INACTIVO'}
            size="small"
            sx={{ 
              fontWeight: 800, 
              fontSize: '10px', 
              borderRadius: '4px' 
            }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Acciones',
        size: 70,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Ver Detalles">
              <IconButton size="small">
                <VisibilityIcon sx={{ fontSize: 18, color: '#64748b' }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: aliases,
    enableDensityToggle: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    localization: MRT_Localization_ES,
    initialState: {
      density: 'compact',
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: 0, border: '1px solid #e2e8f0' }
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        '& .MuiTableCell-root': {
          border: '1px solid rgba(224, 224, 224, 1)',
          fontSize: '12px',
          py: 1,
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f8f9fa',
        fontWeight: 700,
        color: '#1d2d3e',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.05em',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1 }}>
          LISTADO DE OPERARIOS VINCULADOS
        </Typography>
        <Button
          variant="contained"
          size="small"
          disableElevation
          startIcon={<AddIcon />}
          onClick={() => member && onAddAlias?.(member)}
          sx={{
            borderRadius: '6px',
            bgcolor: '#0070f2',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'none',
            px: 1.5,
            height: '28px',
            '&:hover': { bgcolor: '#005bbd' }
          }}
        >
          Nuevo Alias
        </Button>
      </Box>
    ),
  });

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
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : aliases.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
              <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                No hay alias registrados para este usuario.
              </Typography>
              <Button
                variant="contained"
                size="small"
                disableElevation
                startIcon={<AddIcon />}
                onClick={() => member && onAddAlias?.(member)}
                sx={{
                  mt: 2,
                  borderRadius: '6px',
                  bgcolor: '#0070f2',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                Registrar Primer Alias
              </Button>
            </Box>
          ) : (
            <MaterialReactTable table={table} />
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
