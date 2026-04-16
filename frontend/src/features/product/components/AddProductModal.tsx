import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createProduct, updateProduct } from "../api/product.service";
import { ProductFormData, productSchema } from "../schemas/product.schema";
import { IProduct } from "../types/product.types";

interface IProps {
  onClose: () => void;
  onSuccess?: () => void;
  selectedProduct?: IProduct | null;
}

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Toys & Games",
  "Health & Beauty",
  "Automotive",
  "Office Supplies",
  "Jewelry",
  "Pet Supplies",
];

const AddProductModal = ({ onClose, onSuccess, selectedProduct }: IProps) => {
  const isEditing = !!selectedProduct?.id;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Omit<IProduct, "id"> }) =>
      updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: selectedProduct
      ? {
          name: selectedProduct.name,
          category: selectedProduct.category,
          price: String(selectedProduct.price),
          stock: String(selectedProduct.stock),
          sku: selectedProduct.sku,
          image: selectedProduct.image ?? "",
          status: selectedProduct.status,
        }
      : { status: "active" as const },
  });

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sku: data.sku,
      image: data.image || undefined,
      status: data.status,
    };

    if (isEditing) {
      updateMutation.mutate({ id: selectedProduct!.id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "canceled", label: "Canceled" },
    { value: "delivered", label: "Delivered" },
  ];

  const inputClass =
    "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Product Name
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            {...register("name")}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Category
          </label>
          <select {...register("category")} className={inputClass}>
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Price
          </label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            {...register("price")}
            className={inputClass}
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Stock
          </label>
          <input
            type="number"
            placeholder="0"
            {...register("stock")}
            className={inputClass}
          />
          {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            SKU
          </label>
          <input
            type="text"
            placeholder="Enter SKU"
            {...register("sku")}
            className={inputClass}
          />
          {errors.sku && <p className={errorClass}>{errors.sku.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Status
          </label>
          <select {...register("status")} className={inputClass}>
            {statusOptions.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          {errors.status && (
            <p className={errorClass}>{errors.status.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Image URL (optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            {...register("image")}
            className={inputClass}
          />
          {errors.image && <p className={errorClass}>{errors.image.message}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex justify-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 bg-white shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="flex justify-center px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
        >
          {createMutation.isPending || updateMutation.isPending
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProductModal;
