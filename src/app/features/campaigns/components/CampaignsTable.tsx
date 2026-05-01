import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useCampaigns } from '../hooks/useCampaigns';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * CampaignsTable Component
 * Searchable list of clients with nested DataTables for campaigns.
 */
export default function CampaignsTable() {
  const { campaigns, isLoading, finishCampaign } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState('');

  // Agrupamos las campañas por cliente
  const clientsData = useMemo(() => {
    const groups: Record<string, any[]> = {};
    campaigns.forEach(c => {
      const name = c.client?.name || c.clientName || 'PRODUCCIÓN INTERNA';
      if (!groups[name]) groups[name] = [];
      groups[name].push(c);
    });
    return Object.entries(groups).map(([name, clientCampaigns]) => ({
      name,
      campaigns: clientCampaigns,
      id: name,
      activeCount: clientCampaigns.filter(c => c.status === 'ACTIVE').length,
    }));
  }, [campaigns]);

  // Filtrado por nombre de cliente
  const filteredClients = useMemo(() => {
    return clientsData.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientsData, searchTerm]);

  // Configuración de columnas para la tabla interna (Campañas)
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Código',
        size: 120,
        Cell: ({ cell }) => (
          <Typography className="font-mono text-12 font-bold text-primary">
            {cell.getValue<string>() || 'S/C'}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>() === 'ACTIVE' ? 'ACTIVA' : 'FINALIZADA'}
            size="small"
            sx={{ fontWeight: 800, fontSize: '10px', borderRadius: '4px' }}
          />
        ),
      },
      {
        id: 'articleName',
        accessorFn: (row) => row.article?.name || row.articleName,
        header: 'Artículo / Envase',
        size: 250,
      },
      {
        id: 'machineName',
        accessorFn: (row) => row.machine?.name || row.machineName,
        header: 'Línea',
        size: 150,
        Cell: ({ cell }) => cell.getValue<string>() || 'Línea Desconocida',
      },
      {
        accessorKey: 'startedAt',
        header: 'Inicio',
        size: 150,
        Cell: ({ cell }) => cell.getValue<string>() ? format(new Date(cell.getValue<string>()), "dd/MM/yy HH:mm", { locale: es }) : '-',
      },
    ],
    [],
  );

  if (isLoading) {
    return <Typography sx={{ p: 4, textAlign: 'center' }}>Sincronizando producción...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      {/* Barra de Búsqueda Superior */}
      <Box sx={{ mb: 2, px: 1 }}>
        <TextField
          fullWidth
          placeholder="Buscar cliente por nombre..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': { borderColor: '#e2e8f0' },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Lista Compacta de Clientes */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {filteredClients.map((client) => (
          <ClientAccordion
            key={client.id}
            client={client}
            columns={columns}
            finishCampaign={finishCampaign}
          />
        ))}
      </Box>
    </Box>
  );
}

// Componente para cada Cliente (Accordion Compacto)
function ClientAccordion({ client, columns, finishCampaign }: any) {
  const table = useMaterialReactTable({
    columns,
    data: client.campaigns,
    enableDensityToggle: false,
    enablePagination: false,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    localization: MRT_Localization_ES,
    enableRowActions: true,
    positionActionsColumn: 'last',
    initialState: {
      density: 'compact',
      showColumnFilters: false,
      showGlobalFilter: false,
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
        <Tooltip title="Ver Detalles">
          <IconButton size="small"><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton>
        </Tooltip>
        {row.original.status === 'ACTIVE' && (
          <Tooltip title="Finalizar">
            <IconButton size="small" color="error" onClick={() => finishCampaign(row.original.id)}>
              <StopIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: 0 }
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
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1 }}>
        REGISTROS DE PRODUCCIÓN
      </Typography>
    ),
  });

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderBottom: '1px solid #e2e8f0',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { mb: 1, borderBottom: '1px solid #cbd5e1' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: '#475569' }} />}
        sx={{
          minHeight: '56px !important',
          px: 2,
          backgroundColor: client.activeCount > 0 ? '#e2e8f0' : '#f8fafc',
          borderLeft: client.activeCount > 0 ? '6px solid' : '6px solid transparent',
          borderColor: '#475569',
          transition: 'all 0.2s',
          '&:hover': { backgroundColor: '#cbd5e1' },
          '&.Mui-expanded': { 
            backgroundColor: '#cbd5e1',
            borderBottom: '1px solid #94a3b8'
          },
          '& .MuiAccordionSummary-content': { my: '8px !important', alignItems: 'center', gap: 2 }
        }}
      >
        <BusinessIcon sx={{ color: client.activeCount > 0 ? '#1e293b' : '#94a3b8', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a', flex: 1, letterSpacing: '-0.01em' }}>
          {client.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Chip
            label={`${client.campaigns.length} TOTAL`}
            size="small"
            sx={{ height: 22, fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.08)', color: '#475569', borderRadius: '4px' }}
          />
          {client.activeCount > 0 && (
            <Chip
              label={`${client.activeCount} ACTIVAS`}
              size="small"
              sx={{ 
                height: 22, 
                fontSize: '10px', 
                fontWeight: 900, 
                backgroundColor: '#334155', 
                color: 'white',
                borderRadius: '4px'
              }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, backgroundColor: 'white' }}>
        <Box sx={{ borderTop: '1px solid #e2e8f0' }}>
          <MaterialReactTable table={table} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
