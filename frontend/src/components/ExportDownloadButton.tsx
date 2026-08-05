import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV } from "@/utils/exports/exportCsv";
import { exportToPDF } from "@/utils/exports/exportPdf";
import { exportToXLSX } from "@/utils/exports/exportXlsx";
import { processExportData } from "@/utils/exports/processExportData";
import { onError, onSuccess } from "@/utils/toast";

export interface ExportOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  onClick?: () => void;
}

type ExportFormat = "csv" | "xlsx" | "pdf";

interface ExportDownloadButtonProps<T extends object> {
  variant?: "single" | "multi";
  singleLabel?: string;
  options?: ExportOption[] | ExportFormat[];
  onExport?: (format: ExportFormat) => void;
  className?: string;

  // New props for self-contained export
  data?: T[];
  filename?: string;
  columnMapping?: Partial<Record<keyof T, string>>;
  excludeFields?: (keyof T)[];
}

const defaultIcons: Record<
  ExportFormat,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  csv: FileText,
  xlsx: FileSpreadsheet,
  pdf: FileDown,
};

const defaultLabels: Record<ExportFormat, string> = {
  csv: "Export as CSV",
  xlsx: "Export as Excel",
  pdf: "Export as PDF",
};

const ExportDownloadButton = <T extends object>({
  variant = "single",
  singleLabel,
  options = [],
  onExport,
  className,
  data,
  filename = "export",
  columnMapping,
  excludeFields,
}: ExportDownloadButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCSVExport = () => {
    if (!data || data.length === 0) {
      onError(null, "No data to export");
      return;
    }

    try {
      const processedData = processExportData({
        data,
        columnMapping,
        excludeFields,
      });
      exportToCSV(processedData, filename);
      onSuccess("CSV exported successfully");
    } catch (error) {
      onError(error, "Failed to export CSV");
    }
  };

  /**
   * Handles XLSX export
   */
  const handleXLSXExport = async () => {
    if (!data || data.length === 0) {
      onError(null, "No data to export");
      return;
    }

    try {
      const processedData = processExportData({
        data,
        columnMapping,
        excludeFields,
      });
      await exportToXLSX(processedData, filename);
      onSuccess("Excel exported successfully");
    } catch (error) {
      onError(error, "Failed to export Excel");
    }
  };

  /**
   * Handles PDF export
   */
  const handlePDFExport = () => {
    if (!data || data.length === 0) {
      onError(null, "No data to export");
      return;
    }

    try {
      const processedData = processExportData({
        data,
        columnMapping,
        excludeFields,
      });
      exportToPDF(processedData, filename);
      onSuccess("PDF exported successfully");
    } catch (error) {
      onError(error, "Failed to export PDF");
    }
  };

  /**
   * Routes export based on format
   */
  const handleExportByFormat = (format: string) => {
    // Legacy callback support
    if (onExport) {
      onExport(format as ExportFormat);
      return;
    }

    // Self-contained export handling
    switch (format) {
      case "csv":
        handleCSVExport();
        break;
      case "xlsx":
        handleXLSXExport();
        break;
      case "pdf":
        handlePDFExport();
        break;
      default:
        onError(null, `Unknown export format: ${format}`);
    }
  };

  const exportDropdownOptions: ExportOption[] = options.map(opt => {
    if (typeof opt === "string") {
      return {
        label: defaultLabels[opt],
        value: opt,
        icon: defaultIcons[opt],
      };
    }
    return opt;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (variant === "single") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={handleCSVExport}
        className={cn(className)}
      >
        <FileDown className="h-4 w-4" />
        {singleLabel || "Export to CSV"}
      </Button>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <Button
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(className)}
      >
        <FileDown className="h-4 w-4" />
        {singleLabel || "Export"}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-[right] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-1">
            {exportDropdownOptions.map(option => {
              const Icon = option.icon || FileDown;
              return (
                <button
                  key={option.value}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
                  onClick={() => {
                    handleExportByFormat(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDownloadButton;
