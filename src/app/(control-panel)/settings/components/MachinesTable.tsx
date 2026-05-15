import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import EditIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Machine } from "@/app/core/domain/entities/Machine";

interface MachinesTableProps {
  data: Machine[];
  furnaceNamesById: Record<string, string>;
  articleNamesById: Record<string, string>;
  isLoading: boolean;
  onChangeArticle: (machine: Machine) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  isUpdating?: boolean;
}

export function MachinesTable({
  data,
  furnaceNamesById,
  articleNamesById,
  isLoading,
  onChangeArticle,
  onUpdateStatus,
  isUpdating,
}: MachinesTableProps) {
  const columns = useMemo<MRT_ColumnDef<Machine>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nombre de la Máquina",
        size: 240,
        Cell: ({ cell }) => (
          <Typography className="font-bold text-13">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: "furnaceId",
        header: "Horno Asociado",
        size: 200,
        Cell: ({ row }) => (
          <Typography className="text-13">
            {furnaceNamesById[row.original.furnaceId] || "Sin referencia"}
          </Typography>
        ),
      },
      {
        accessorKey: "currentArticleId",
        header: "Artículo Actual",
        size: 240,
        Cell: ({ row }) => (
          <Typography className="text-13">
            {row.original.currentArticleId
              ? articleNamesById[row.original.currentArticleId] ||
                "Artículo no disponible"
              : "Sin artículo asignado"}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado Operativo",
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
                OPERATIVA
              </MenuItem>
              <MenuItem value="maintenance" sx={{ fontSize: '10px', fontWeight: 800 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main', mr: 1 }} />
                MANTENIMIENTO
              </MenuItem>
              <MenuItem value="shutdown" sx={{ fontSize: '10px', fontWeight: 800 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
                DETENIDA
              </MenuItem>
            </Select>
          </FormControl>
        ),
      },
    ],
    [articleNamesById, furnaceNamesById, onUpdateStatus, isUpdating],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    localization: MRT_Localization_ES,
    enableDensityToggle: false,
    enableEditing: true,
    editDisplayMode: "cell",
    enableRowActions: true,
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Acciones",
        size: 100,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        <Tooltip title="Ver Detalles">
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              opacity: 0.7,
              "&:hover": { opacity: 1, color: "primary.main" },
            }}
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Máquina">
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              opacity: 0.7,
              "&:hover": { opacity: 1, color: "secondary.main" },
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cambio de artículo">
          <IconButton
            size="small"
            onClick={() => onChangeArticle(row.original)}
            sx={{
              color: "text.secondary",
              opacity: 0.7,
              "&:hover": { opacity: 1, color: "info.main" },
            }}
          >
            <SyncAltIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    initialState: {
      density: "compact",
      showGlobalFilter: true,
    },
    renderTopToolbarCustomActions: () => (
      <Box
        sx={{ display: "flex", gap: "12px", alignItems: "center", p: "4px" }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "text.secondary",
            borderColor: "divider",
            textTransform: "none",
          }}
        >
          Exportar Reporte
        </Button>
      </Box>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
        border: "1px solid",
        borderColor: "divider",
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: "collapse",
        "& .MuiTableCell-root": {
          border: "1px solid rgba(224, 224, 224, 1)",
          fontFamily: 'var(--fuse-font-family, "Inter", sans-serif)',
          fontSize: "13px",
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
        paddingY: "4px",
      },
    },
  });

  return (
    <Box className="w-full h-full">
      <MaterialReactTable table={table} />
    </Box>
  );
}
