import { IEmployee } from "@/features/employee/types/employee.types";
import { IProduct } from "@/features/product/types/product.types";

interface IDeleteConfirmModal {
  employee?: IEmployee;
  product?: IProduct;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  employee,
  product,
  onConfirm,
  onCancel,
}: IDeleteConfirmModal) => {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
        Delete {employee && "Employee"} {product && "Product"}
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to delete{" "}
        <span className="font-medium">
          {employee && `${employee?.first_name} ${employee?.last_name}`}
          {product && product.name}
        </span>
        ? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-error-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
