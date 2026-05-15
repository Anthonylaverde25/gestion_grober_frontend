import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { format } from "date-fns";
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { LineYield } from "@/app/core/domain/entities/LineYield";
import { useTheme, alpha } from "@mui/material/styles";

// Sub-components & Hooks
import { useYieldHistoryExport } from "./yield-table/useYieldHistoryExport";
import { useYieldHistoryTableColumns } from "./yield-table/useYieldHistoryTableColumns";
import { YieldHistoryToolbar } from "./yield-table/YieldHistoryToolbar";

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
  const [batchSize, setBatchSize] = useState<BatchSize>(1);
  
  const { exportToExcel } = useYieldHistoryExport(campaign);
  
  const columns = useYieldHistoryTableColumns({ 
    theme, 
    isDark, 
    onExportBatch: exportToExcel 
  });

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
                ? (isDark ? alpha(theme.palette.primary.main, 0.2) : '#0f172a') 
                : 'inherit',
            height: row.original.isSummary ? '52px' : 'inherit',
            '&:hover': { 
                backgroundColor: row.original.isSummary 
                    ? (isDark ? alpha(theme.palette.primary.main, 0.3) : '#1e293b') 
                    : 'inherit' 
            },
            '& .MuiTableCell-root': {
                borderBottom: row.original.isSummary ? '2px solid' : '1px solid',
                borderBottomColor: row.original.isSummary ? 'primary.main' : 'divider',
            }
        }
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <YieldHistoryToolbar 
        table={table} 
        batchSize={batchSize} 
        setBatchSize={setBatchSize} 
        isDark={isDark} 
        onExport={exportToExcel}
      />
    ),
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
