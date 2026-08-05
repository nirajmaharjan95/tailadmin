import { Badge } from "@/components/ui/badge";
import { UserRole, UserStatus } from "@/features/authentication/types/auth.types";
import { formatDate } from "@/utils/formatDate";
import { createColumnHelper } from "@tanstack/react-table";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { IUser } from "../types/user.types";

const columnHelper = createColumnHelper<IUser>();

const roleColors: Record<UserRole, string> = {
  admin: "bg-brand-50 text-brand-500",
  user: "bg-gray-100 text-gray-800",
};

const statusColors: Record<UserStatus, string> = {
  ACTIVE: "bg-success-50 text-success-600",
  DISABLED: "bg-gray-100 text-gray-800",
  LOCKED: "bg-error-50 text-error-600",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  user: "User",
};

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Active",
  DISABLED: "Disabled",
  LOCKED: "Locked",
};

const widthConfig = {
  name: 240,
  role: 100,
  status: 110,
  createdAt: 140,
  action: 80,
};

const TableColumns = (
  onEdit: (user: IUser) => void,
  onDelete: (user: IUser) => void,
  currentUserId?: number
) => [
  columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
    id: "name",
    header: () => <span>Name</span>,
    cell: info => (
      <>
        <p className="block text-theme-sm font-medium text-gray-800 dark:text-white/90">
          {info.getValue()}
        </p>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {info.row.original.email}
        </span>
      </>
    ),
    size: widthConfig.name,
  }),
  columnHelper.accessor("role", {
    header: () => <span>Role</span>,
    cell: info => (
      <Badge className={roleColors[info.getValue()]}>
        {roleLabels[info.getValue()]}
      </Badge>
    ),
    size: widthConfig.role,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: info => (
      <Badge className={statusColors[info.getValue()]}>
        {statusLabels[info.getValue()]}
      </Badge>
    ),
    size: widthConfig.status,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Created At</span>,
    cell: info => formatDate(new Date(info.getValue())),
    size: widthConfig.createdAt,
  }),
  // This screen is admin-only, so the actions column is always rendered.
  // Deleting yourself is rejected server-side, so the button is hidden.
  columnHelper.display({
    id: "actions",
    header: () => <span>Actions</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Edit ${row.original.firstName} ${row.original.lastName}`}
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
          onClick={() => onEdit(row.original)}
        >
          <LuPencil size={18} />
        </button>
        {row.original.id !== currentUserId && (
          <button
            type="button"
            aria-label={`Delete ${row.original.firstName} ${row.original.lastName}`}
            className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
            onClick={() => onDelete(row.original)}
          >
            <LuTrash2 size={18} />
          </button>
        )}
      </div>
    ),
    size: widthConfig.action,
  }),
];

export default TableColumns;
