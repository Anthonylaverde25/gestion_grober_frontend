import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { Campaign } from "@/app/core/domain/entities/Campaign";
import { useBusiness } from "@/app/contexts/BusinessContext";

export const useYieldHistoryExport = (campaign?: Campaign | null) => {
  const { activeCompany } = useBusiness();

  const exportToExcel = async (data: any[], filename: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Yield Report", {
      views: [{ showGridLines: false }] // SAP Fiori prefiere un canvas limpio
    });

    // --- 0. COLORES SAP FIORI ---
    const colors = {
      fioriBlue: "FF0070F2",
      textMain: "FF32363A",
      textSub: "FF6A6D70",
      bgHeader: "FFF2F2F2",
      bgSelected: "FFE5F0FA",
      borderLight: "FFE5E5E5",
      borderDark: "FF89919A"
    };

    // Configuración Base de Columnas (Sin Observaciones)
    worksheet.columns = [
      { key: "date", width: 22 },
      { key: "operator", width: 35 },
      { key: "forming", width: 18 },
      { key: "packing", width: 18 },
    ];

    // --- 1. CABECERA TIPO FIORI ---
    worksheet.getRow(1).height = 45;
    
    // Título Principal
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Production Yield Traceability";
    titleCell.font = { name: "Arial", size: 16, color: { argb: colors.textMain } };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };
    worksheet.mergeCells("A1:B1");

    // Metadata SAP (Derecha) - Sistema, Campaña, Artículo
    const metaCell = worksheet.getCell("D1");
    metaCell.value = `System: ${activeCompany?.name || 'N/A'}\nArticle: ${campaign?.article?.name || 'N/A'}\nCampaign: ${campaign?.codigo || 'N/A'}\nDate: ${format(new Date(), "dd.MM.yyyy")}`;
    metaCell.font = { name: "Arial", size: 9, color: { argb: colors.textSub } };
    metaCell.alignment = { vertical: "middle", horizontal: "right", wrapText: true };
    worksheet.mergeCells("C1:D1");

    // Espaciador
    worksheet.getRow(2).height = 15;

    // --- 2. TABLA HEADER ---
    const tableHeaderRow = 3;
    const headerLabels = ["Date & Time", "Operator / ID", "Forming Yield", "Packing Yield"];
    const headerRow = worksheet.getRow(tableHeaderRow);
    headerRow.values = headerLabels;
    headerRow.height = 24;
    
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: colors.textMain } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.bgHeader } };
      cell.alignment = { vertical: "middle" };
      cell.border = { 
        bottom: { style: "thin", color: { argb: colors.borderDark } },
        top: { style: "thin", color: { argb: colors.borderDark } }
      };
    });

    // --- 3. DATOS ---
    data.forEach((row) => {
      const isSummary = row.isSummary;
      const dataRow = worksheet.addRow([
        isSummary ? `Batch: ${row.range}` : format(new Date(row.recordedAt), "dd.MM.yyyy HH:mm"),
        isSummary ? "Consolidated Batch Metrics" : (row.alias ? `${row.alias.name} (${row.alias.legajo})` : "-"),
        typeof row.formingYield === 'number' ? row.formingYield / 100 : 0,
        typeof row.packingYield === 'number' ? row.packingYield / 100 : 0
      ]);

      dataRow.height = 20;
      dataRow.font = { name: "Arial", size: 10, color: { argb: colors.textMain } };
      dataRow.alignment = { vertical: "middle" };
      
      dataRow.getCell(3).numFmt = "0.00%";
      dataRow.getCell(4).numFmt = "0.00%";

      if (isSummary) {
        dataRow.font = { name: "Arial", size: 10, bold: true, color: { argb: colors.fioriBlue } };
        dataRow.eachCell(cell => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.bgSelected } };
        });
      }

      dataRow.eachCell(cell => {
        // En Fiori, las filas regulares tienen un borde inferior muy sutil
        if (!isSummary) {
           cell.border = { bottom: { style: "hair", color: { argb: colors.borderLight } } };
        }
      });
    });

    // --- 4. RESUMEN GLOBAL ---
    worksheet.addRow([]); // Espaciador
    const summaryRow = worksheet.addRow(["", "Overall Average:",
      { formula: `AVERAGE(C${tableHeaderRow + 1}:C${worksheet.lastRow!.number - 1})` },
      { formula: `AVERAGE(D${tableHeaderRow + 1}:D${worksheet.lastRow!.number - 1})` }
    ]);
    summaryRow.height = 28;
    summaryRow.font = { name: "Arial", size: 11, bold: true, color: { argb: colors.textMain } };
    summaryRow.getCell(3).numFmt = "0.00%";
    summaryRow.getCell(4).numFmt = "0.00%";
    summaryRow.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
    summaryRow.getCell(3).alignment = { vertical: "middle" };
    summaryRow.getCell(4).alignment = { vertical: "middle" };

    summaryRow.eachCell(cell => {
      cell.border = { top: { style: "thin", color: { argb: colors.borderDark } } };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
  };

  return { exportToExcel };
};
