import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChartIcon from "@mui/icons-material/TableChart";
import HistoryIcon from '@mui/icons-material/History';
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { LineYield } from "@/app/core/domain/entities/LineYield";
import { useTheme, alpha } from "@mui/material/styles";

interface YieldHistoryTableProps {
  history: LineYield[];
  campaign?: Campaign | null;
  isLoading?: boolean;
}

type BatchSize = 1 | 3 | 6;

export default function YieldHistoryTable({
  history,
  campaign,
  isLoading,
}: YieldHistoryTableProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [batchSize, setBatchSize] = useState<BatchSize>(1);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const processedData = useMemo(() => {
    if (batchSize === 1) return history.map(h => ({ ...h, isSummary: false }));
    const result: any[] = [];
    const sortedHistory = [...history].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    for (let i = 0; i < sortedHistory.length; i += batchSize) {
      const chunk = sortedHistory.slice(i, i + batchSize);
      chunk.forEach(record => result.push({ ...record, isSummary: false }));
      const formingAvg = chunk.reduce((acc, curr) => acc + curr.formingYield, 0) / chunk.length;
      const packingAvg = chunk.reduce((acc, curr) => acc + curr.packingYield, 0) / chunk.length;
      const firstDate = new Date(chunk[0].recordedAt);
      const lastDate = new Date(chunk[chunk.length - 1].recordedAt);
      result.push({
        id: `summary-${i}`,
        isSummary: true,
        recordedAt: chunk[chunk.length - 1].recordedAt,
        formingYield: formingAvg,
        packingYield: packingAvg,
        rawItems: chunk,
        notes: `MÉTRICA CONSOLIDADA DEL LOTE`,
        range: `${format(firstDate, "HH:mm")} - ${format(lastDate, "HH:mm")}`
      });
    }
    return result.reverse();
  }, [history, batchSize]);

  const exportDataToExcel = async (data: any[], filename: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rendimiento");
    const titleRow = worksheet.addRow(["REPORTE DE TRAZABILIDAD DE RENDIMIENTO (YIELD)"]);
    worksheet.mergeCells("A1:E1");
    titleRow.font = { name: "Arial Black", size: 14, color: { argb: "FFFFFFFF" }, bold: true };
    titleRow.alignment = { vertical: "middle", horizontal: "center" };
    titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B1B1B" } };
    worksheet.getRow(1).height = 35;
    worksheet.addRow([]);
    worksheet.addRow(["Línea:", campaign?.machineName || "N/A", "Campaña:", campaign?.codigo || "N/A"]);
    worksheet.addRow(["Fecha:", format(new Date(), "dd/MM/yyyy HH:mm")]);
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(["FECHA Y HORA", "OPERADOR", "FORMING (%)", "PACKING (%)", "OBSERVACIONES"]);
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE9ECEF" } };
      cell.font = { bold: true };
    });
    data.forEach((row) => {
      worksheet.addRow([
        format(new Date(row.recordedAt), "dd/MM/yyyy HH:mm"),
        row.alias?.name || "-",
        typeof row.formingYield === 'number' ? `${row.formingYield.toFixed(2)}%` : '-',
        typeof row.packingYield === 'number' ? `${row.packingYield.toFixed(2)}%` : '-',
        row.notes || "",
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
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
                 <Typography sx={{ fontWeight: 800, color: row.original.isSummary ? 'primary.contrastText' : 'text.primary', fontSize: '12px', letterSpacing: '0.05em' }}>
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
          const userAliasId = row.original.userAliasId;

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

          if (userAliasId) {
            return (
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>
                Cargando...
              </Typography>
            );
          }

          return (
            <Typography sx={{ fontSize: '11px', color: 'text.disabled' }}>
              -
            </Typography>
          );
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
                        onClick={() => exportDataToExcel(row.original.rawItems, `lote-${row.original.range}`)}
                        sx={{ color: 'primary.contrastText', bgcolor: alpha(theme.palette.primary.contrastText, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.contrastText, 0.2) } }}
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
    [theme.palette.mode, campaign],
  );

  const table = useMaterialReactTable({
    columns,
    data: processedData,
    state: { isLoading },
    localization: MRT_Localization_ES,
    enableDensityToggle: false,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: (row) => !row.original.isSummary,
    enableSelectAll: true,
    getRowId: (row) => row.id || row.recordedAt.toString(),
    initialState: {
      density: "compact",
      showGlobalFilter: true,
      pagination: { pageSize: 50, pageIndex: 0 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: { borderRadius: "0", border: "none", bgcolor: 'background.paper' },
    },
    muiTableProps: {
      sx: {
        borderCollapse: "collapse",
        "& .MuiTableCell-root": { border: "1px solid", borderColor: 'divider', fontSize: "13px", color: 'text.primary' },
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
        sx: {
            backgroundColor: row.original.isSummary 
                ? (isDark ? alpha(theme.palette.primary.main, 0.2) : '#1b1b1b') 
                : 'inherit',
            height: row.original.isSummary ? '52px' : 'inherit',
            '&:hover': { 
                backgroundColor: row.original.isSummary 
                    ? (isDark ? alpha(theme.palette.primary.main, 0.3) : '#2d2d2d') 
                    : 'inherit' 
            },
            '& .MuiTableCell-root': {
                borderBottom: row.original.isSummary ? '2px solid' : '1px solid',
                borderBottomColor: row.original.isSummary ? 'primary.main' : 'divider',
            }
        }
    }),
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table.getSelectedRowModel().rows;
      const hasSelection = selectedRows.length > 0;

      return (
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center", p: "4px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', mr: 1 }}>
                Lotes:
            </Typography>
            {[1, 3, 6].map((size) => (
                <Button
                    key={size}
                    variant={batchSize === size ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setBatchSize(size as BatchSize)}
                    sx={{
                        minWidth: 'auto',
                        height: 24,
                        fontSize: '9px',
                        fontWeight: 900,
                        borderRadius: 0,
                        border: '1px solid',
                        borderColor: batchSize === size ? (isDark ? 'primary.main' : '#1b1b1b') : 'divider',
                        bgcolor: batchSize === size ? (isDark ? 'primary.main' : '#1b1b1b') : 'transparent',
                        color: batchSize === size ? '#fff' : 'text.secondary',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: batchSize === size ? (isDark ? 'primary.dark' : '#2d2d2d') : 'background.default', boxShadow: 'none' }
                    }}
                >
                    {size === 1 ? 'OFF' : `${size}H`}
                </Button>
            ))}
          </Box>

          <Box sx={{ width: '1px', height: 16, bgcolor: 'divider' }} />

          <Button
            variant="contained"
            size="small"
            disabled={!hasSelection}
            startIcon={<FileDownloadIcon sx={{ fontSize: '16px !important' }} />}
            onClick={handleExportClick}
            sx={{
              height: 24,
              fontSize: "10px",
              fontWeight: 900,
              textTransform: "uppercase",
              bgcolor: isDark ? 'primary.main' : '#1b1b1b',
              color: '#fff',
              boxShadow: 'none',
              borderRadius: 0,
              '&:hover': { bgcolor: isDark ? 'primary.dark' : '#2d2d2d', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
            }}
          >
            Exportar {hasSelection ? `(${selectedRows.length})` : ""}
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => {
                exportDataToExcel(table.getSelectedRowModel().rows.map(r => r.original), "export-seleccion");
                handleClose();
            }}>
              <ListItemIcon><TableChartIcon fontSize="small" sx={{ color: '#1D6F42' }} /></ListItemIcon>
              <ListItemText primary="Descargar Excel (.xlsx)" />
            </MenuItem>
          </Menu>
        </Box>
      );
    },
  });

  return (
    <section className="flex-1 min-h-[500px] flex flex-col border overflow-hidden" style={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}>
      <div className="px-gutter py-4 border-b flex items-center justify-between" style={{ backgroundColor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8f9fa', borderColor: theme.palette.divider }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: theme.palette.text.secondary }}>list_alt</span>
          <h3 className="font-headline-md text-sm" style={{ color: theme.palette.text.primary }}>Trazabilidad Histórica de Rendimiento</h3>
        </div>
      </div>
      <Box sx={{ flex: 1, w: '100%', overflow: 'auto' }}>
        <MaterialReactTable table={table} />
      </Box>
    </section>
  );
}
