import { useState, useMemo } from 'react';
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
  Tooltip,
  Tabs,
  Tab
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
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useUserAliases } from '../../api/hooks/team/useUserAliases';
import { SettingsTeamMember } from '../../api/types';
import { UserAlias } from '@/app/core/domain/entities/UserAlias';

interface ViewAliasesDialogProps {
  open: boolean;
  onClose: () => void;
  member: SettingsTeamMember | null;
  onAddAlias?: (member: SettingsTeamMember) => void;
}

export function ViewAliasesDialog({ open, onClose, member, onAddAlias }: ViewAliasesDialogProps) {
  const { aliases, isLoading, toggleStatus, isToggling } = useUserAliases(member ? parseInt(member.id) : undefined);

  const activeAliases = useMemo(() => aliases.filter(a => a.isActive), [aliases]);
  const inactiveAliases = useMemo(() => aliases.filter(a => !a.isActive), [aliases]);

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
        id: 'actions',
        header: 'Acciones',
        size: 70,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title={row.original.isActive ? "Desactivar Alias" : "Activar Alias"}>
              <IconButton
                size="small"
                onClick={() => toggleStatus(row.original.id)}
                disabled={isToggling}
              >
                <PowerSettingsNewIcon sx={{ fontSize: 18, color: row.original.isActive ? '#ef4444' : '#22c55e' }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [toggleStatus, isToggling],
  );

  const tableConfig = {
    columns,
    enableDensityToggle: false,
    enablePagination: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    localization: MRT_Localization_ES,
    initialState: {
      density: 'compact' as const,
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
          fontSize: '11px',
          py: 0.75,
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f8f9fa',
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        fontSize: '10px',
        letterSpacing: '0.05em',
      },
    },
  };

  const activeTable = useMaterialReactTable({
    ...tableConfig,
    data: activeAliases,
  });

  const inactiveTable = useMaterialReactTable({
    ...tableConfig,
    data: inactiveAliases,
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
            Gestion de Alias de Operario
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

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {/* SECCIÓN ACTIVOS */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ● Operarios en Turno (Activos)
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    startIcon={<AddIcon />}
                    onClick={() => member && onAddAlias?.(member)}
                    sx={{
                      borderRadius: '4px',
                      bgcolor: '#0f172a',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 1.5,
                      height: '24px',
                      '&:hover': { bgcolor: '#334155' }
                    }}
                  >
                    Nuevo Alias
                  </Button>
                </Box>
                {activeAliases.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    <Typography sx={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      No hay operarios activos vinculados.
                    </Typography>
                  </Box>
                ) : (
                  <MaterialReactTable table={activeTable} />
                )}
              </Box>

              {/* SECCIÓN INACTIVOS */}
              <Box>
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ○ Historial de Alias (Desactivados)
                  </Typography>
                </Box>
                {inactiveAliases.length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f8fafc', border: '1px dashed #e2e8f0' }}>
                    <Typography sx={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                      No hay registros en el historial de inactivos.
                    </Typography>
                  </Box>
                ) : (
                  <MaterialReactTable table={inactiveTable} />
                )}
              </Box>
            </>
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
