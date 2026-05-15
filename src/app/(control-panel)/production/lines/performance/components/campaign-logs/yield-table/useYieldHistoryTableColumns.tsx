import { useMemo } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HistoryIcon from '@mui/icons-material/History';
import TableChartIcon from "@mui/icons-material/TableChart";
import { format } from "date-fns";
import { alpha, Theme } from "@mui/material/styles";

interface ColumnProps {
  theme: Theme;
  isDark: boolean;
  onExportBatch: (data: any[], range: string) => void;
}

export const useYieldHistoryTableColumns = ({ theme, isDark, onExportBatch }: ColumnProps) => {
  return useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "recordedAt",
        header: "Fecha y Hora",
        size: 250,
        Cell: ({ row }) => {
          if (row.original.isSummary) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 1, py: 0.2, borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <HistoryIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontWeight: 900, fontSize: '10px' }}>LOTE</Typography>
                 </Box>
                 <Typography sx={{ fontWeight: 800, color: 'primary.contrastText', fontSize: '12px', letterSpacing: '0.05em' }}>
                    {row.original.range}
                 </Typography>
              </Box>
            );
          }
          return (
            <Typography sx={{ fontFamily: 'var(--fuse-font-family, "Inter", sans-serif)', fontSize: '13px', color: 'text.primary' }}>
              {format(new Date(row.original.recordedAt), "dd/MM/yyyy HH:mm")}
            </Typography>
          );
        },
      },
      {
        accessorKey: "alias.name",
        header: "Operador",
        size: 200,
        Cell: ({ row }) => {
          if (row.original.isSummary) return null;
          
          const alias = row.original.alias;
          if (alias) {
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main' }}>
                  {alias.name}
                </Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontFamily: 'monospace' }}>
                  {alias.legajo}
                </Typography>
              </Box>
            );
          }
          return row.original.userAliasId ? 
            <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>Cargando...</Typography> :
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>-</Typography>;
        },
      },
      {
        accessorKey: "formingYield",
        header: "Forming %",
        size: 150,
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ cell, row }) => (
          <Typography sx={{ 
            fontFamily: 'monospace', 
            fontWeight: row.original.isSummary ? 900 : 600,
            fontSize: row.original.isSummary ? '16px' : '13px',
            color: row.original.isSummary ? (isDark ? 'primary.light' : 'primary.main') : 'text.primary'
          }}>
            {typeof cell.getValue<number>() === 'number' ? `${cell.getValue<number>().toFixed(2)}%` : '-'}
          </Typography>
        ),
      },
      {
        accessorKey: "packingYield",
        header: "Packing %",
        size: 150,
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ cell, row }) => (
          <Typography sx={{ 
            fontFamily: 'monospace', 
            fontWeight: row.original.isSummary ? 900 : 600,
            fontSize: row.original.isSummary ? '16px' : '13px',
            color: row.original.isSummary ? (isDark ? 'primary.light' : 'primary.main') : 'text.primary'
          }}>
            {typeof cell.getValue<number>() === 'number' ? `${cell.getValue<number>().toFixed(2)}%` : '-'}
          </Typography>
        ),
      },
      {
        accessorKey: "notes",
        header: "Observaciones / Registro de Mermas",
        size: 400,
        Cell: ({ cell, row }) => {
          if (row.original.isSummary) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Exportar Lote a Excel">
                    <IconButton 
                        size="small" 
                        onClick={() => onExportBatch(row.original.rawItems, `lote-${row.original.range}`)}
                        sx={{ 
                          color: 'primary.contrastText', 
                          bgcolor: alpha(theme.palette.primary.contrastText, 0.1), 
                          '&:hover': { bgcolor: alpha(theme.palette.primary.contrastText, 0.2) } 
                        }}
                    >
                        <TableChartIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
              </Box>
            );
          }
          return (
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic' }}>
              {cell.getValue<string>() || "-"}
            </Typography>
          );
        },
      },
    ],
    [theme, isDark, onExportBatch]
  );
};
