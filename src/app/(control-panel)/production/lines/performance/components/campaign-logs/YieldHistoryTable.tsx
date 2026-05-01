import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from "@mui/icons-material/TableChart";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { LineYield } from "@/app/core/domain/entities/LineYield";

interface YieldHistoryTableProps {
  history: LineYield[];
  campaign?: Campaign | null;
  isLoading?: boolean;
}

export default function YieldHistoryTable({ history, campaign, isLoading }: YieldHistoryTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = async (rows: MRT_Row<any>[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Monitor de Rendimiento");

    const titleRow = worksheet.addRow(["REPORTE DE TRAZABILIDAD DE RENDIMIENTO (YIELD)"]);
    worksheet.mergeCells("A1:E1");
    titleRow.font = { name: "Arial Black", size: 14, color: { argb: "FFFFFFFF" }, bold: true };
    titleRow.alignment = { vertical: "middle", horizontal: "center" };
    titleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF087AD1" } };
    worksheet.getRow(1).height = 35;

    worksheet.addRow([]);
    worksheet.addRow(["Línea:", campaign?.machineName || "N/A", "Campaña ID:", campaign?.codigo || "N/A"]);
    worksheet.addRow(["Fecha Reporte:", format(new Date(), "dd/MM/yyyy HH:mm")]);
    worksheet.addRow(["Artículo:", campaign?.articleName || "N/A", "Cliente:", campaign?.clientName || "N/A"]);
    worksheet.addRow([]);

    const headerRow = worksheet.addRow(["FECHA Y HORA", "FORMING YIELD (%)", "PACKING YIELD (%)", "TOTAL YIELD (%)", "OBSERVACIONES"]);
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE9ECEF" } };
      cell.font = { bold: true, size: 10 };
      cell.alignment = { horizontal: "center" };
    });

    rows.forEach((row) => {
      worksheet.addRow([
        format(new Date(row.original.recordedAt), "dd/MM/yyyy HH:mm"),
        `${row.original.formingYield.toFixed(2)}%`,
        `${row.original.packingYield.toFixed(2)}%`,
        "-",
        row.original.notes || "",
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `monitor-yield-${campaign?.codigo || 'export'}-${format(new Date(), 'yyyyMMdd')}.xlsx`);
    handleClose();
  };

  const exportToPdf = (rows: MRT_Row<any>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => [
      format(new Date(row.original.recordedAt), "dd/MM/yyyy HH:mm"),
      `${row.original.formingYield.toFixed(2)}%`,
      `${row.original.packingYield.toFixed(2)}%`,
      row.original.notes || "-",
    ]);

    doc.setFontSize(18);
    doc.setTextColor(8, 122, 209);
    doc.text(`REPORTE DE TRAZABILIDAD DE RENDIMIENTO`, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(85, 91, 98);
    doc.text(`Línea: ${campaign?.machineName || 'N/A'}`, 14, 30);
    doc.text(`Campaña: ${campaign?.codigo || 'N/A'}`, 14, 35);
    doc.text(`Fecha Reporte: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 40);
    
    autoTable(doc, {
      head: [['FECHA Y HORA', 'FORMING (%)', 'PACKING (%)', 'OBSERVACIONES']],
      body: tableData,
      startY: 48,
      headStyles: { fillColor: [8, 122, 209], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { top: 48 },
    });

    doc.save(`reporte-yield-${campaign?.codigo || 'maquina'}.pdf`);
    handleClose();
  };

  const columns = useMemo<MRT_ColumnDef<LineYield>[]>(
    () => [
      {
        accessorKey: "recordedAt",
        header: "Fecha y Hora",
        size: 200,
        Cell: ({ cell }) => (
          <Typography className="font-data-tabular">
            {format(new Date(cell.getValue<Date>()), "dd/MM/yyyy HH:mm")}
          </Typography>
        ),
      },
      {
        accessorKey: "formingYield",
        header: "Forming %",
        size: 150,
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <Typography className="font-data-tabular font-bold text-on-surface-variant">
            {`${cell.getValue<number>().toFixed(2)}%`}
          </Typography>
        ),
      },
      {
        accessorKey: "packingYield",
        header: "Packing %",
        size: 150,
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ cell }) => (
          <Typography className="font-data-tabular font-bold text-primary">
            {`${cell.getValue<number>().toFixed(2)}%`}
          </Typography>
        ),
      },
      {
        accessorKey: "notes",
        header: "Observaciones / Registro de Mermas",
        size: 400,
        Cell: ({ cell }) => (
          <Typography className="text-[12px] text-on-surface-variant italic">
            {cell.getValue<string>() || "-"}
          </Typography>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: history,
    state: { isLoading },
    localization: MRT_Localization_ES,
    enableDensityToggle: false,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: true,
    enableSelectAll: true,
    initialState: {
      density: "compact",
      showGlobalFilter: true,
      pagination: { pageSize: 15, pageIndex: 0 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: 'none',
      },
    },
    muiTableProps: {
      sx: {
        borderCollapse: 'collapse',
        '& .MuiTableCell-root': {
          border: '1px solid',
          borderColor: 'divider',
          fontSize: '13px',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f8f9fa',
        fontWeight: 700,
        color: 'text.primary',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.05em',
        borderBottom: '2px solid',
        borderColor: 'divider',
      },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table.getSelectedRowModel().rows;
      const hasSelection = selectedRows.length > 0;

      return (
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', p: '4px' }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            disabled={!hasSelection}
            startIcon={<FileDownloadIcon />}
            onClick={handleExportClick}
            sx={{ 
              fontSize: '12px', 
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Exportar {hasSelection ? `(${selectedRows.length})` : ''}
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => exportToExcel(selectedRows)}>
              <ListItemIcon>
                <TableChartIcon fontSize="small" sx={{ color: '#1D6F42' }} />
              </ListItemIcon>
              <ListItemText primary="Descargar Excel Pro (.xlsx)" />
            </MenuItem>
            <MenuItem onClick={() => exportToPdf(selectedRows)}>
              <ListItemIcon>
                <PictureAsPdfIcon fontSize="small" sx={{ color: '#E44031' }} />
              </ListItemIcon>
              <ListItemText primary="Descargar PDF Pro (.pdf)" />
            </MenuItem>
          </Menu>
          
          {!hasSelection && (
            <Typography variant="caption" className="text-on-surface-variant italic">
              Seleccione filas para exportar
            </Typography>
          )}
        </Box>
      );
    },
  });

  return (
    <section className="flex-1 min-h-[500px] flex flex-col bg-surface-container-lowest border border-outline-variant overflow-hidden">
      <div className="px-gutter py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">
            list_alt
          </span>
          <h3 className="font-headline-md text-sm text-on-surface">
            Trazabilidad Histórica de Rendimiento
          </h3>
        </div>
      </div>

      <Box className="flex-1 w-full overflow-auto">
        <MaterialReactTable table={table} />
      </Box>
      
      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
            Auditoría de Rendimiento de Línea
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600 }}>
            {history.length} REGISTROS EN ESTA CAMPAÑA
        </Typography>
      </Box>
    </section>
  );
}
