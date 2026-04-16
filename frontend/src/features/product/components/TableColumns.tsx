import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from "@tanstack/react-table";
import { LuImage, LuPencil, LuTrash2 } from "react-icons/lu";
import { IProduct } from "../types/product.types";

const columnHelper = createColumnHelper<IProduct>();

const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  const colorMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    canceled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    delivered: "bg-purple-100 text-purple-800",
  };
  return colorMap[normalizedStatus] || "bg-gray-100 text-gray-800";
};

const widthConfig = {
  product: 200,
  category: 150,
  price: 100,
  stock: 80,
  status: 100,
  action: 80,
};

const TableColumns = (
  onEdit: (product: IProduct) => void,
  onDelete: (id: number) => void
) => [
  columnHelper.accessor((row) => ({ image: row.image, name: row.name }), {
    id: "product",
    header: "Product",
    cell: ({ getValue }) => {
      const { image, name } = getValue();
      return (
        <div className="flex items-center gap-2">
          {image ? (
            <img src={image} alt={name} className="h-10 w-10 rounded" />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-grey-50">
              <LuImage size={20} />
            </div>
          )}
          <span>{name}</span>
        </div>
      );
    },
    size: widthConfig.product,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    size: widthConfig.category,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `${info.getValue()}`,
    size: widthConfig.price,
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
    size: widthConfig.stock,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge className={getStatusColor(info.getValue())}>
        {info.getValue().toLowerCase()}
      </Badge>
    ),
    size: widthConfig.status,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)}
          disabled={row.original.status.toLowerCase() === "delivered"}
          className={`text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 ${
            row.original.status.toLowerCase() === "delivered"
              ? "opacity-50 cursor-not-allowed hover:text-gray-500 dark:hover:text-gray-400"
              : ""
          }`}
        >
          <LuPencil size={18} />
        </button>
        <button
          onClick={() => {
            onDelete(row.original.id);
          }}
          disabled={row.original.status.toLowerCase() === "delivered"}
          className={`text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 ${
            row.original.status.toLowerCase() === "delivered"
              ? "opacity-50 cursor-not-allowed hover:text-gray-500 dark:hover:text-gray-400"
              : ""
          }`}
        >
          <LuTrash2 size={18} />
        </button>
      </div>
    ),
    size: widthConfig.action,
  }),
];

export default TableColumns;
