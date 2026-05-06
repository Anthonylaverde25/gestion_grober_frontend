import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useClients } from '../hooks/useClients';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/EditOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { Client } from '@/app/core/domain/entities/Client';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * ClientsTable Component
 * Spreadsheet-style presentation for clients.
 * Optimized for Dark Mode and industrial aesthetics.
 */
export default function ClientsTable() {
  const { clients, isLoading } = useClients();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const columns = useMemo<MRT_ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'taxId',
        header: 'CUIT / Tax ID',
        size: 150,
        Cell: ({ cell }) => (
          <Box 
            component="span"
            sx={{ 
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 900,
                color: isDark ? `${theme.palette.primary.light} !important` : `${theme.palette.primary.main} !important`,
            }}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        accessorKey: 'commercialName',
        header: 'Nombre Comercial',
        size: 250,
        Cell: ({ cell }) => (
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                {cell.getValue<string>()}
            </Typography>
        )
      },
      {
        accessorKey: 'businessName',
        header: 'Razón Social',
        size: 250,
        Cell: ({ cell }) => (
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {cell.getValue<string>()}
            </Typography>
        )
      },
      {
        accessorKey: 'technicalContact',
        header: 'Contacto Técnico',
        size: 200,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic', color: 'text.secondary' }}>
            {cell.getValue<string>() || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
        Cell: ({ cell }) => (
            <Typography sx={{ fontSize: '12px', color: 'text.primary' }}>
                {cell.getValue<string>()}
            </Typography>
        )
      },
    ],
    [theme.palette.mode],
  );

  const table = useMaterialReactTable({
    columns,
    data: clients,
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
        size: 80,
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
            onClick={() => console.log('View:', row.original.id)}
            sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1, color: 'primary.main' } }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Cliente">
          <IconButton 
            size="small" 
            onClick={() => console.log('Edit:', row.original.id)}
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
          Exportar Excel
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<FileUploadIcon />}
          sx={{ 
            fontSize: '12px', 
            fontWeight: 600,
            textTransform: 'none',
            borderColor: 'divider',
            color: 'text.secondary'
          }}
        >
          Importar Clientes
        </Button>
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid',
          borderColor: 'divider',
          fontFamily: 'var(--fuse-font-family, "Inter", sans-serif)',
          fontSize: '13px',
          color: 'text.primary'
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8f9fa',
        fontWeight: 700,
        color: 'text.primary',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.05em',
        borderBottom: '2px solid',
        borderBottomColor: 'divider'
      },
    },
    muiTableBodyCellProps: {
      sx: {
        paddingY: '4px',
        color: 'text.primary'
      },
    },
    muiTopToolbarProps: {
        sx: {
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider'
        }
    },
    muiBottomToolbarProps: {
        sx: {
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider'
        }
    }
  });

  return (
    <Box className="w-full h-full" sx={{ bgcolor: 'background.default' }}>
      <MaterialReactTable table={table} />
    </Box>
  );
}
