import writeExcelFile, { type Cell, type Value } from "write-excel-file/universal";

/**
 * Converts a processed export value into a valid XLSX cell value,
 * preserving numbers, booleans, and dates, and stringifying anything else
 */
const toCellValue = (value: unknown): Value => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return String(value);
};

/**
 * Exports data to an XLSX file
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export async function exportToXLSX(
  data: Record<string, unknown>[],
  filename: string
): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  const headers = Object.keys(data[0]);

  const headerRow: Cell[] = headers.map(header => ({
    value: header,
    fontWeight: "bold",
    backgroundColor: "#1d4ed8",
    textColor: "#ffffff",
  }));

  const bodyRows: Cell[][] = data.map(row =>
    headers.map(header => ({ value: toCellValue(row[header]) }))
  );

  const columns = headers.map(() => ({ width: 20 }));

  const blob = await writeExcelFile([headerRow, ...bodyRows], { columns }).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xlsx`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
