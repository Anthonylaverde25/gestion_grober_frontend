import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableChartIcon from "@mui/icons-material/TableChart";
import { MRT_TableInstance } from "material-react-table";

interface ToolbarProps {
  table: MRT_TableInstance<any>;
  batchSize: number;
  setBatchSize: (size: 1 | 3 | 6) => void;
  isDark: boolean;
  onExport: (data: any[], filename: string) => void;
}

export const YieldHistoryToolbar = ({ table, batchSize, setBatchSize, isDark, onExport }: ToolbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                onClick={() => setBatchSize(size as 1 | 3 | 6)}
                sx={{
                    minWidth: 'auto',
                    height: 24,
                    fontSize: '9px',
                    fontWeight: 900,
                    borderRadius: 0,
                    border: '1px solid',
                    borderColor: batchSize === size ? (isDark ? 'primary.main' : '#0f172a') : 'divider',
                    bgcolor: batchSize === size ? (isDark ? 'primary.main' : '#0f172a') : 'transparent',
                    color: batchSize === size ? '#fff' : 'text.secondary',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: batchSize === size ? (isDark ? 'primary.dark' : '#1e293b') : 'background.default', boxShadow: 'none' }
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
          bgcolor: isDark ? 'primary.main' : '#0f172a',
          color: '#fff',
          boxShadow: 'none',
          borderRadius: 0,
          '&:hover': { bgcolor: isDark ? 'primary.dark' : '#1e293b', boxShadow: 'none' },
          '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' }
        }}
      >
        Exportar {hasSelection ? `(${selectedRows.length})` : ""}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => {
            onExport(table.getSelectedRowModel().rows.map(r => r.original), "export-seleccion");
            handleClose();
        }}>
          <ListItemIcon><TableChartIcon fontSize="small" sx={{ color: '#1D6F42' }} /></ListItemIcon>
          <ListItemText primary="Descargar Excel (.xlsx)" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
