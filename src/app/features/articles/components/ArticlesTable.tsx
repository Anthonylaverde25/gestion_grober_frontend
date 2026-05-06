import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Article } from '@/app/core/domain/entities/Article';
import { useArticles } from '../hooks/useArticles';
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
import { useNavigate } from 'react-router';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * ArticlesTable Component
 * Spreadsheet-style presentation with View and Edit actions.
 * Optimized for Dark Mode and industrial aesthetics.
 */
export default function ArticlesTable() {
  const { articles, isLoading } = useArticles();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const tableData = useMemo(() => {
    return articles.map((article, index) => ({
      ...article,
      code: `ART-00${index + 101}`,
      clientName: article.client?.name || 'Artículo Genérico',
    }));
  }, [articles]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Código',
        size: 100,
        Cell: ({ cell, row }) => (
          <Box 
            component="span"
            onClick={() => navigate(`/articles/${row.original.id}`)}
            sx={{ 
                fontFamily: 'monospace',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                // Forzamos el color para evitar herencia o clases globales
                color: isDark ? `${theme.palette.primary.light} !important` : `${theme.palette.primary.main} !important`,
            }}
          >
            {cell.getValue<string>()}
          </Box>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Descripción del Artículo',
        size: 300,
        Cell: ({ cell }) => (
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                {cell.getValue<string>()}
            </Typography>
        )
      },
      {
        accessorKey: 'clientName',
        header: 'Producido para',
        size: 200,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic', color: 'text.secondary' }}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
    ],
    [theme.palette.mode, navigate],
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
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
            onClick={() => navigate(`/articles/${row.original.id}`)}
            sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1, color: 'primary.main' } }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Artículo">
          <IconButton 
            size="small" 
            onClick={() => console.log('Editar:', row.original.id)}
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
          Importar Artículos
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
