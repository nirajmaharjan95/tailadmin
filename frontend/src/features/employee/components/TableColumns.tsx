import { formatDate } from "@/utils/formatDate";
import { formatPhoneNumber } from "@/utils/formatPhone";
import { createColumnHelper } from "@tanstack/react-table";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { IEmployee } from "../types/employee.types";

const columnHelper = createColumnHelper<IEmployee>();

const widthConfig = {
  name: 200,
  age: 80,
  position: 100,
  office: 150,
  startDate: 150,
  action: 80,
};

const TableColumns = (
  onEdit: (employee: IEmployee) => void,
  onDelete: (employee: IEmployee) => void,
  isAdmin?: boolean
) => [
  columnHelper.accessor("name", {
    header: () => <span>Name</span>,
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.first_name} ${rowA.original.last_name}`;
      const b = `${rowB.original.first_name} ${rowB.original.last_name}`;
      return a.localeCompare(b);
    },
    cell: (info) => (
      <>
        <p className="block text-theme-sm font-medium text-gray-800 dark:text-white/90">
          {`${info.row.original.first_name}  ${info.row.original.last_name}`}
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {info.row.original.email}
        </span>
      </>
    ),
    size: widthConfig.name,
  }),
  columnHelper.accessor("age", {
    header: () => <span>Age</span>,
  }),
  columnHelper.accessor("position", {
    header: () => <span>Position</span>,
  }),
  columnHelper.accessor("office", {
    header: () => <span>Office</span>,
  }),
  columnHelper.accessor("start_date", {
    header: () => <span>Start Date</span>,
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor("salary", {
    header: () => <span>Salary</span>,
  }),
  columnHelper.accessor("phone", {
    header: () => <span>Phone</span>,
    cell: (info) => <span>{formatPhoneNumber(info.getValue())}</span>,
  }),

  // TanStack React Table expects a flat array of column definitions. Without the spread operator, you'd have a nested array [[...]], which breaks the table structure.
  ...(isAdmin
    ? [
        columnHelper.accessor("actions", {
          header: () => <span>Actions</span>,
          enableSorting: false,
          cell: (info) => {
            const rowData = info.row.original;
            return (
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                  onClick={() => onEdit(rowData)}
                >
                  <LuPencil size={18} />
                </button>
                <button
                  className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                  onClick={() => onDelete(rowData)}
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            );
          },
          size: widthConfig.action,
        }),
      ]
    : []),
];

export default TableColumns;
