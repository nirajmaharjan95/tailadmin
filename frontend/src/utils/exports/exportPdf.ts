import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

/**
 * Exports data to a PDF file
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export function exportToPDF(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const headers = Object.keys(data[0]);
  const title = filename.charAt(0).toUpperCase() + filename.slice(1);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: data.map(row => headers.map(h => String(row[h] ?? ""))),
    headStyles: { fillColor: [29, 78, 216] },
    styles: { fontSize: 8 },
  });

  doc.save(`${filename}.pdf`);
}
