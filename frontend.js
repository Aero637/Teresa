import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Export to Excel
export const exportToExcel = (data, filename = 'Monthly_Report.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, filename);
};

// Export to PDF with timestamps & page numbers
export const exportToPDF = (title, columns, rows, selectedMonth) => {
  const doc = new jsPDF();
  const downloadDateTime = new Date().toLocaleString('en-IN');

  // Header info
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Reporting Period: ${selectedMonth}`, 14, 22);
  doc.text(`Generated On: ${downloadDateTime}`, 14, 28);

  // Table content
  doc.autoTable({
    startY: 34,
    head: [columns],
    body: rows,
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Page ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(9);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  doc.save(`${title.replace(/\s+/g, '_')}_${selectedMonth}.pdf`);
};