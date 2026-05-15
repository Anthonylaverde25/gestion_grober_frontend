import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Furnace } from '@/app/core/domain/entities/Furnace';
import { Box, Chip, IconButton, Tooltip, Typography, Button, MenuItem, Select, FormControl } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface FurnacesTableProps {
  data: Furnace[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
  isUpdating?: boolean;
}

export function FurnacesTable({ data, isLoading, onUpdateStatus, isUpdating }: FurnacesTableProps) {
  const columns = useMemo<MRT_ColumnDef<Furnace>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre del Horno',
        size: 250,
        Cell: ({ cell }) => (
          <Typography className="font-bold text-13">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'maxCapacityTons',
        header: 'Capacidad Máx.',
        size: 150,
        Cell: ({ cell }) => (
          <Box className="flex items-center gap-2">
            <Typography className="font-mono text-12">
              {cell.getValue<number>()}
            </Typography>
            <Typography className="text-11 opacity-50 font-bold">TONS</Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado Operativo',
        size: 180,
        Cell: ({ row }) => (
          <FormControl size="small" fullWidth>
            <Select
              value={row.original.status}
              onChange={(e) => {
                if (onUpdateStatus) {
                  onUpdateStatus(row.original.id, e.target.value as string);
                }
              }}
              disabled={isUpdating}
              sx={{ 
                height: 28, 
                fontSize: '10px', 
                fontWeight: 800,
                backgroundColor: (theme) => alpha(theme.palette.background.default, 0.5),
                '& .MuiSelect-select': {
                  py: 0,
                  display: 'flex',
                  alignItems: 'center',
                  textTransform: 'uppercase'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider'
                }
              }}
            >
              <MenuItem value="operational" sx={{ fontSize: '10px', fontWeight: 800 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                OPERATIVO
              </MenuItem>
              <MenuItem value="maintenance" sx={{ fontSize: '10px', fontWeight: 800 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 1 }} />
                MANTENIMIENTO
              </MenuItem>
              <MenuItem value="shutdown" sx={{ fontSize: '10px', fontWeight: 800 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
                APAGADO
              </MenuItem>
            </Select>
          </FormControl>
        ),
      },
    ],
    [onUpdateStatus, isUpdating],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    localization: MRT_Localization_ES,
    enableDensityToggle: false,
    enableEditing: true,
    editDisplayMode: 'cell',
    enableRowActions: true,
    positionActionsColumn: 'last',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
        size: 100,
        muiTableHeadCellProps: {
            align: 'center',
        },
        muiTableBodyCellProps: {
            align: 'center',
        },
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <Tooltip title="Ver Detalles">
          <IconButton 
            size="small" 
            sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1, color: 'primary.main' } }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Horno">
          <IconButton 
            size="small" 
            sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1, color: 'secondary.main' } }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    initialState: { 
        density: 'compact',
        showGlobalFilter: true,
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', p: '4px' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{ 
            fontSize: '12px', 
            fontWeight: 600,
            color: 'text.secondary',
            borderColor: 'divider',
            textTransform: 'none',
          }}
        >
          Exportar Reporte
        </Button>
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: '1px solid',
        borderColor: 'divider',
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid rgba(224, 224, 224, 1)',
          fontFamily: 'var(--fuse-font-family, "Inter", sans-serif)',
          fontSize: '13px',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : '#f8f9fa',
        fontWeight: 700,
        color: 'text.primary',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.05em',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        paddingY: '4px',
      },
    },
  });

  return (
    <Box className="w-full h-full">
      <MaterialReactTable table={table} />
    </Box>
  );
}
