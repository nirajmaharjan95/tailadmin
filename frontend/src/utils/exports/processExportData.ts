import { formatDate } from "@/utils/formatDate";
import { autoFormatFieldName } from "@/utils/autoFormatFieldName";
import { isISODateString } from "@/utils/isISODateString";

/**
 * Configuration options for processing export data
 *
 * @template T - The type of data being processed
 */
export interface ProcessExportDataOptions<T> {
  data: T[];
  columnMapping?: Partial<Record<keyof T, string>>;
  excludeFields?: (keyof T)[];
}

/**
 * Formats a single value for export, handling special types like dates
 *
 * This function ensures consistent formatting across all export formats by:
 * - Converting Date objects to formatted date strings
 * - Converting ISO date strings to formatted date strings
 * - Passing through all other values unchanged
 *
 * @param value - The value to format (can be any type)
 * @returns The formatted value, or the original value if no formatting is needed
 *
 * @example
 * ```ts
 * formatExportValue(new Date('2024-01-15')); // Returns "Jan 15, 2024"
 * formatExportValue('2024-01-15T10:30:00.000Z'); // Returns "Jan 15, 2024"
 * formatExportValue('John Doe'); // Returns "John Doe"
 * formatExportValue(42); // Returns 42
 * ```
 */
export const formatExportValue = (value: unknown): unknown => {
  if (value instanceof Date) return formatDate(value);

  // Handle ISO date strings (e.g., "2024-01-15T10:30:00.000Z")
  if (isISODateString(value)) return formatDate(new Date(value as string));

  return value;
};

/**
 * Gets the display name for a field, using custom mapping or auto-formatting
 *
 * This function determines the column name to use in the export by:
 * 1. First checking if a custom mapping is provided for the field
 * 2. If no mapping exists, auto-formatting the field name (e.g., "firstName" -> "First Name")
 *
 * @template T - The type of the data object
 * @param key - The field key to get the column name for
 * @param columnMapping - Optional mapping of field keys to custom column names
 * @returns The column name to use in the export
 *
 * @example
 * ```ts
 * // With custom mapping
 * getExportColumnName('firstName', { firstName: 'Given Name' }); // Returns "Given Name"
 *
 * // Without mapping (auto-formatted)
 * getExportColumnName('firstName'); // Returns "First Name"
 * getExportColumnName('email_address'); // Returns "Email Address"
 * ```
 */
export const getExportColumnName = <T>(
  key: keyof T,
  columnMapping?: Partial<Record<keyof T, string>>
): string => {
  return columnMapping?.[key] || autoFormatFieldName(String(key));
};

/**
 * Processes raw data for export by formatting values, applying column mappings, and filtering fields
 *
 * The function maintains type safety while producing a generic Record structure
 * suitable for various export formats (CSV, Excel, etc.)
 *
 * @template T - The type of data being processed (must be an object)
 * @param options - Configuration object containing data and processing options
 * @param options.data - Array of data items to process
 * @param options.columnMapping - Optional mapping of field keys to custom column names
 * @param options.excludeFields - Optional array of field keys to exclude from export
 * @returns Array of processed data objects ready for export
 *
 * @example
 * ```ts
 * const employees = [
 *   { id: 1, firstName: 'John', hireDate: '2023-01-15T00:00:00.000Z' },
 *   { id: 2, firstName: 'Jane', hireDate: '2023-02-20T00:00:00.000Z' }
 * ];
 *
 * const processed = processExportData({
 *   data: employees,
 *   columnMapping: { firstName: 'Name', hireDate: 'Hired On' },
 *   excludeFields: ['id']
 * });
 *
 * // Result:
 * // [
 * //   { 'Name': 'John', 'Hired On': 'Jan 15, 2023' },
 * //   { 'Name': 'Jane', 'Hired On': 'Feb 20, 2023' }
 * // ]
 * ```
 */
export const processExportData = <T extends object>({
  data,
  columnMapping,
  excludeFields,
}: ProcessExportDataOptions<T>): Record<string, unknown>[] => {
  return data.map(item => {
    const processed: Record<string, unknown> = {};

    (Object.keys(item) as (keyof T)[]).forEach(key => {
      if (excludeFields?.includes(key)) return;
      const columnName = getExportColumnName(key, columnMapping);
      processed[columnName] = formatExportValue(item[key]);
    });

    return processed;
  });
};
