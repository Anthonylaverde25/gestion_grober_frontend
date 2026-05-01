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

/**
 * ClientsTable Component
 * Spreadsheet-style presentation for clients.
 */
export default function ClientsTable() {
  const { clients, isLoading } = useClients();

  const columns = useMemo<MRT_ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'taxId',
        header: 'CUIT / Tax ID',
        size: 150,
        Cell: ({ cell }) => (
          <Typography className="font-mono text-12 font-bold text-primary">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'commercialName',
        header: 'Commercial Name',
        size: 250,
      },
      {
        accessorKey: 'businessName',
        header: 'Business Name',
        size: 250,
      },
      {
        accessorKey: 'technicalContact',
        header: 'Contact',
        size: 200,
        Cell: ({ cell }) => (
          <Typography className="text-12 opacity-80 italic">
            {cell.getValue<string>() || 'N/A'}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
      },
    ],
    [],
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
        <Tooltip title="View Details">
          <IconButton 
            size="small" 
            onClick={() => console.log('View:', row.original.id)}
            sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1, color: 'primary.main' } }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Client">
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
          Export Excel
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
          }}
        >
          Import Clients
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
        backgroundColor: '#f8f9fa',
        fontWeight: 700,
        color: '#1d2d3e',
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
