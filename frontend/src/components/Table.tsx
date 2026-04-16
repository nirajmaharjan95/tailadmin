import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Pagination from "./Pagination";
import { Skeleton } from "./ui/skeleton";

interface ITable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
  isPaginationVisible?: boolean;
  isLoading?: boolean;
  // SSR pagination props
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const Table = ({
  data,
  columns,
  isPaginationVisible = true,
  isLoading = false,
  pageSize: propPageSize,
  pageIndex: propPageIndex,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: ITable) => {
  const isServerSide = onPageChange !== undefined;

  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagination: PaginationState = isServerSide
    ? { pageIndex: propPageIndex ?? 0, pageSize: propPageSize ?? 10 }
    : localPagination;

  const pageCount =
    isServerSide && totalCount !== undefined
      ? Math.ceil(totalCount / pagination.pageSize)
      : undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: isServerSide ? undefined : setLocalPagination,
    onSortingChange: setSorting,
    state: { pagination, sorting },
    manualPagination: isServerSide,
    pageCount,
    autoResetPageIndex: false,
  });

  const currentPage = pagination.pageIndex + 1;
  const totalPages = pageCount ?? table.getPageCount();

  const handlePrev = () => {
    if (isServerSide) {
      onPageChange(pagination.pageIndex - 1);
    } else {
      table.previousPage();
    }
  };

  const handleNext = () => {
    if (isServerSide) {
      onPageChange(pagination.pageIndex + 1);
    } else {
      table.nextPage();
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isServerSide) {
      onPageSizeChange?.(size);
    } else {
      table.setPageSize(size);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width:
                        header.column.columnDef.size !== undefined
                          ? header.column.columnDef.size
                          : "auto",
                    }}
                    className={`border-r text-left border-gray-200 px-4 py-3 dark:border-gray-800 text-theme-xs font-bold text-gray-700 dark:text-gray-400 ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <span className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{ asc: " ↑", desc: " ↓" }[
                              header.column.getIsSorted() as string
                            ] ?? " ↕"}
                          </span>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    {table.getAllLeafColumns().map((col) => (
                      <td
                        key={col.id}
                        className="border-r border-gray-200 px-4 py-3 dark:border-gray-800"
                        style={{
                          width:
                            col.columnDef.size !== undefined
                              ? col.columnDef.size
                              : "auto",
                        }}
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          width:
                            cell.column.columnDef.size !== undefined
                              ? cell.column.columnDef.size
                              : "auto",
                        }}
                        className="border-r border-gray-200 px-4 py-3 dark:border-gray-800 text-theme-xs font-medium text-gray-700 dark:text-gray-400"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {isPaginationVisible && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pagination.pageSize}
          onPrev={handlePrev}
          onNext={handleNext}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  );
};

export default Table;
