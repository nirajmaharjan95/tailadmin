/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Optional custom headers mapping { fieldName: "Header Label" }
 * @returns CSV formatted string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: Partial<Record<keyof T, string>>
): string {
  if (!data || data.length === 0) {
    return "";
  }

  // Get all keys from the first object
  const keys = Object.keys(data[0]) as (keyof T)[];

  // Create header row
  const headerRow = keys
    .map(key => {
      const headerLabel = headers?.[key] || String(key);
      return escapeCSVField(headerLabel);
    })
    .join(",");

  // Create data rows
  const dataRows = data.map(item =>
    keys
      .map(key => {
        const value = item[key];
        return escapeCSVField(formatCSVValue(value));
      })
      .join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Formats a value for CSV output
 */
function formatCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return String(value);
}

/**
 * Escapes and wraps a field for CSV
 */
function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Downloads a CSV file
 * @param csvContent CSV content string
 * @param filename Name of the file (without extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param headers Optional custom headers mapping
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: Partial<Record<keyof T, string>>
): void {
  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, filename);
}
