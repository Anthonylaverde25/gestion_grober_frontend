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
import { useTheme, alpha } from '@mui/material/styles';

/**
 * CampaignsTable Component
 * Searchable list of clients with nested DataTables for campaigns.
 */
export default function CampaignsTable() {
  const { campaigns, isLoading, finishCampaign } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          <Typography sx={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: 'primary.main' }}>
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
            sx={{ 
                fontWeight: 800, 
                fontSize: '10px', 
                borderRadius: '4px',
                bgcolor: cell.getValue<string>() === 'ACTIVE' 
                    ? (isDark ? alpha(theme.palette.success.main, 0.1) : '#dcfce7')
                    : (isDark ? alpha(theme.palette.text.secondary, 0.1) : '#f1f5f9'),
                color: cell.getValue<string>() === 'ACTIVE'
                    ? (isDark ? 'success.light' : '#166534')
                    : (isDark ? 'text.secondary' : '#475569')
            }}
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
    [theme.palette.mode],
  );

  if (isLoading) {
    return <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Sincronizando producción...</Typography>;
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
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'primary.main' },
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          <IconButton size="small"><VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></IconButton>
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
      sx: { borderRadius: 0, bgcolor: 'background.paper' }
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'separate',
        borderSpacing: 0,
        '& .MuiTableCell-root': {
          border: '1px solid',
          borderColor: 'divider',
          fontSize: '12px',
          py: 1,
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
      },
    },
    renderTopToolbarCustomActions: () => (
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1 }}>
        REGISTROS DE PRODUCCIÓN
      </Typography>
    ),
  });

  const summaryBg = client.activeCount > 0 
    ? (isDark ? alpha(theme.palette.primary.main, 0.15) : '#e2e8f0') 
    : (isDark ? alpha(theme.palette.background.paper, 0.5) : '#f8fafc');

  const expandedBg = isDark ? alpha(theme.palette.primary.main, 0.25) : '#cbd5e1';

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'transparent',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { mb: 1, borderBottom: '1px solid', borderColor: 'divider' }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
        sx={{
          minHeight: '56px !important',
          px: 2,
          backgroundColor: summaryBg,
          borderLeft: client.activeCount > 0 ? '6px solid' : '6px solid transparent',
          borderColor: client.activeCount > 0 ? 'primary.main' : 'transparent',
          transition: 'all 0.2s',
          '&:hover': { backgroundColor: expandedBg },
          '&.Mui-expanded': { 
            backgroundColor: expandedBg,
            borderBottom: '1px solid',
            borderColor: isDark ? 'primary.main' : 'divider'
          },
          '& .MuiAccordionSummary-content': { my: '8px !important', alignItems: 'center', gap: 2 }
        }}
      >
        <BusinessIcon sx={{ color: client.activeCount > 0 ? 'primary.main' : 'text.disabled', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', flex: 1, letterSpacing: '-0.01em' }}>
          {client.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Chip
            label={`${client.campaigns.length} TOTAL`}
            size="small"
            sx={{ 
                height: 22, 
                fontSize: '10px', 
                fontWeight: 700, 
                backgroundColor: isDark ? alpha(theme.palette.text.secondary, 0.1) : 'rgba(0,0,0,0.08)', 
                color: 'text.secondary', 
                borderRadius: '4px' 
            }}
          />
          {client.activeCount > 0 && (
            <Chip
              label={`${client.activeCount} ACTIVAS`}
              size="small"
              sx={{ 
                height: 22, 
                fontSize: '10px', 
                fontWeight: 900, 
                backgroundColor: 'secondary.main', 
                color: 'secondary.contrastText',
                borderRadius: '4px'
              }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, backgroundColor: 'background.paper' }}>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <MaterialReactTable table={table} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
