import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled, useTheme } from "@mui/material/styles";
import PageHeader from "@/app/components/PageHeader";
import { useMemo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useExtractionHistory } from "@/app/features/extraction/hooks/useExtractionHistory";
import { useExtractionDashboard } from "@/app/features/extraction/hooks/useExtractionDashboard";
import { useArticles } from "@/app/features/articles/hooks/useArticles";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    padding: 0,
    backgroundColor: theme.palette.background.default,
  },
}));

export default function ExtractionMachineHistory() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { machineId } = useParams();
  const navigate = useNavigate();
  
  const { history, isLoading: historyLoading } = useExtractionHistory(machineId);
  const { furnaces, isLoading: dashboardLoading } = useExtractionDashboard();
  const { articles, isLoading: articlesLoading } = useArticles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isLoading = historyLoading || dashboardLoading || articlesLoading;

  // Enrich history data with article names if the backend returns "N/A"
  const enrichedHistory = useMemo(() => {
    if (!history.length || !articles.length) return history;

    return history.map((record) => {
      if (record.articleName === "N/A" || !record.articleName) {
        const articleMatch = articles.find((a) => a.id === record.articleId);
        if (articleMatch) {
          return {
            ...record,
            articleName: articleMatch.name,
          };
        }
      }
      return record;
    });
  }, [history, articles]);

  // Find current machine and furnace
  const machineData = useMemo(() => {
    for (const furnace of furnaces) {
      const machine = furnace.machines?.find((m) => m.id === machineId);
      if (machine) {
        return { machine, furnace };
      }
    }
    return null;
  }, [furnaces, machineId]);

  const latestExtraction = enrichedHistory.length > 0 ? enrichedHistory[0] : null;

  // Export Logic
  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = async (rows: MRT_Row<any>[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial de Extracciones');

    // 1. Add Title Row
    const titleRow = worksheet.addRow(['REPORTE DE TRAZABILIDAD DE EXTRACCIÓN']);
    worksheet.mergeCells('A1:D1');
    titleRow.font = { name: 'Arial Black', size: 16, color: { argb: 'FFFFFFFF' }, bold: true };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    titleRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF087AD1' }
    };
    worksheet.getRow(1).height = 40;

    // 2. Add Info Section
    worksheet.addRow([]);
    worksheet.addRow(['Máquina:', machineData?.machine?.name || 'N/A', 'Empresa:', 'Gestión Grober']);
    worksheet.addRow(['Horno:', machineData?.furnace?.name || 'N/A', 'Fecha Reporte:', format(new Date(), 'dd/MM/yyyy HH:mm')]);
    worksheet.addRow(['Artículo Actual:', machineData?.machine?.currentArticleName || 'Sin asignar']);
    worksheet.addRow([]);

    // Style info section
    ['A3', 'C3', 'A4', 'C4', 'A5'].forEach(cell => {
      worksheet.getCell(cell).font = { bold: true, color: { argb: 'FF444444' } };
    });

    // 3. Define Columns & Headers
    const headerRow = worksheet.addRow(['FECHA Y HORA', 'ARTÍCULO EN PRODUCCIÓN', 'EXTRACCIÓN (%)', 'ESTADO OPERATIVO']);
    
    // Style headers
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE9ECEF' }
      };
      cell.font = { bold: true, size: 11, color: { argb: 'FF1D2D3E' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'bold' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    worksheet.getRow(7).height = 25;

    // 4. Add Data Rows
    rows.forEach((row, index) => {
      const dataRow = worksheet.addRow([
        format(new Date(row.original.measuredAt), "dd/MM/yyyy HH:mm"),
        row.original.articleName,
        Number(row.original.percentage.toFixed(2)),
        row.original.isActive ? 'ACTIVO' : 'INACTIVO'
      ]);

      // Zebra stripes and borders
      dataRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (index % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F9FA' }
          };
        }
        
        // Alignment
        if (colNumber === 1 || colNumber === 4) cell.alignment = { horizontal: 'center' };
        if (colNumber === 3) {
            cell.alignment = { horizontal: 'right' };
            cell.numFmt = '0.00"%"';
        }
      });
    });

    // Set Column Widths
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 45;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;

    // Generate and Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `reporte-extraccion-${machineData?.machine?.name || 'maquina'}-${format(new Date(), 'yyyyMMdd')}.xlsx`);
    handleClose();
  };

  const exportToPdf = (rows: MRT_Row<any>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => [
      format(new Date(row.original.measuredAt), "dd/MM/yyyy HH:mm"),
      row.original.articleName,
      `${row.original.percentage.toFixed(2)}%`,
      row.original.isActive ? 'Activo' : 'Inactivo',
    ]);

    // Header styling for PDF
    doc.setFontSize(18);
    doc.setTextColor(8, 122, 209);
    doc.text(`REPORTE DE TRAZABILIDAD DE EXTRACCIÓN`, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(85, 91, 98);
    doc.text(`Máquina: ${machineData?.machine?.name || 'N/A'}`, 14, 30);
    doc.text(`Horno: ${machineData?.furnace?.name || 'N/A'}`, 14, 35);
    doc.text(`Fecha Reporte: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 40);
    
    autoTable(doc, {
      head: [['FECHA Y HORA', 'ARTÍCULO EN PRODUCCIÓN', 'EXTRACCIÓN (%)', 'ESTADO']],
      body: tableData,
      startY: 48,
      headStyles: { fillColor: [8, 122, 209], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { top: 48 },
    });

    doc.save(`reporte-extraccion-${machineData?.machine?.name || 'maquina'}.pdf`);
    handleClose();
  };

  // MRT Column Definitions
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'measuredAt',
        header: 'Fecha y Hora',
        size: 200,
        Cell: ({ cell }) => (
          <Typography className="font-data-tabular">
             {format(new Date(cell.getValue<string>()), "dd/MM/yyyy HH:mm")}
          </Typography>
        ),
      },
      {
        accessorKey: 'articleName',
        header: 'Artículo en Producción',
        size: 300,
        Cell: ({ cell }) => (
          <Typography className={`text-[13px] ${cell.getValue<string>() === 'N/A' ? 'italic opacity-60' : 'font-medium'}`}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'percentage',
        header: 'Extracción (%)',
        size: 150,
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => (
          <Typography className="font-data-tabular font-bold text-primary">
            {cell.getValue<number>().toFixed(2)}%
          </Typography>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        size: 120,
        muiTableBodyCellProps: {
            align: 'center',
        },
        Cell: ({ cell }) => {
          const isActive = cell.getValue<boolean>();
          return (
             <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  isActive
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {isActive ? "Activo" : "Inactivo"}
              </span>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: enrichedHistory,
    state: { isLoading },
    localization: MRT_Localization_ES,
    enableDensityToggle: false,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: true,
    enableSelectAll: true,
    initialState: { 
        density: 'compact',
        showGlobalFilter: true,
        pagination: { pageSize: 15, pageIndex: 0 },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '0',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
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
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
        fontWeight: 700,
        color: 'text.primary',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.05em',
        borderBottom: '2px solid',
        borderColor: 'divider',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        paddingY: '8px',
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

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Root
      header={
        <PageHeader
          title="Historial de Extracciones"
          subtitle={`Trazabilidad de producción para la unidad operativa`}
          action={
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Icon>arrow_back</Icon>}
              onClick={() => navigate("/production/extraction")}
            >
              Volver al Dashboard
            </Button>
          }
        />
      }
      content={
        <Box className="flex flex-col flex-auto h-full">
          {/* Machine and Article Context Header - Ancho Completo */}
          <section className="bg-[#e2e8f0] border-b border-outline-variant px-margin-edge py-gutter shadow-none rounded-none">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-center gap-gutter">
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <Typography variant="h5" className="font-black text-[#0f172a] uppercase tracking-tight">
                    {machineData?.machine?.name || 'Cargando...'}
                  </Typography>
                  <span className={`px-2 py-0.5 self-center md:self-auto rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    machineData?.machine?.status === 'operational' 
                      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                      : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    {machineData?.machine?.status || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-1 text-[#475569] text-[13px] font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">heat_pump</span>
                      <span>Horno: <span className="text-on-surface">{machineData?.furnace?.name || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                      <span>Artículo Actual: <span className="text-on-surface uppercase">{machineData?.machine?.currentArticleName || 'Sin asignar'}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">event</span>
                      <span>Última Medición: <span className="text-on-surface font-data-tabular">{latestExtraction ? format(latestExtraction.measuredAt, 'dd/MM/yyyy HH:mm') : 'N/A'}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end text-right border-l border-white/40 pl-gutter hidden md:flex">
                <Typography variant="caption" className="uppercase font-black text-[#475569] tracking-widest text-[9px]">
                    Eficiencia de Extracción
                </Typography>
                <div className="flex items-baseline gap-1">
                    <Typography variant="h4" className="font-data-tabular font-bold text-primary">
                      {latestExtraction?.percentage.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="caption" className="font-bold text-primary">%</Typography>
                </div>
              </div>
            </div>
          </section>

          <div className="pb-16 px-margin-edge max-w-[1600px] mx-auto w-full pt-8 flex flex-col gap-8 h-full">
            {/* Dashboard Summary Section */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                  Registros Totales
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-on-surface">
                    {enrichedHistory.length}
                  </span>
                  <span className="text-on-surface-variant mb-1 font-medium">
                    Entradas
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                  Promedio de Extracción
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {enrichedHistory.length > 0
                      ? (
                          enrichedHistory.reduce(
                            (acc, curr) => acc + curr.percentage,
                            0,
                          ) / enrichedHistory.length
                        ).toFixed(2)
                      : "0.00"}
                    %
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant p-stack-md flex flex-col gap-1 rounded-none shadow-none">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">
                  Variación (Últimos 10)
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-on-surface">
                    {enrichedHistory.length > 1
                      ? (enrichedHistory[0].percentage - enrichedHistory[1].percentage).toFixed(2)
                      : "0.00"}
                    %
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* MaterialReactTable Section */}
          <section className="flex-1 min-h-[500px] flex flex-col bg-surface-container-lowest border border-outline-variant overflow-hidden">
            <div className="px-gutter py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">
                  list_alt
                </span>
                <h3 className="font-headline-md text-sm text-on-surface">
                  Registro Histórico Detallado
                </h3>
              </div>
            </div>

            <Box className="flex-1 w-full overflow-auto">
               <MaterialReactTable table={table} />
            </Box>
          </section>
        </div>
      </Box>
    }
  />
);
}
