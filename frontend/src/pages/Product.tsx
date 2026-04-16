import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import {
  deleteProduct,
  getProducts,
} from "@/features/product/api/product.service";
import AddProductModal from "@/features/product/components/AddProductModal";
import TableColumns from "@/features/product/components/TableColumns";
import { IProduct } from "@/features/product/types/product.types";
import { ModalType } from "@/types/Types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchParams((prev) => {
        if (value) {
          prev.set("search", value);
        } else {
          prev.delete("search");
        }
        prev.delete("page");
        return prev;
      });
    }, 500);
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", pageIndex, pageSize, search],
    queryFn: () =>
      getProducts({ limit: pageSize, offset: pageIndex * pageSize, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      handleClose();
    },
  });

  const products = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
    setModalType("add");
  };

  const handleOpenEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setModalType("edit");
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalType(null);
  };

  const handleConfirmationModal = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setModalType("delete");
      setIsModalOpen(true);
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams((prev) => {
      const newPage = newPageIndex + 1;
      if (newPage <= 1) {
        prev.delete("page");
      } else {
        prev.set("page", String(newPage));
      }
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", String(newPageSize));
      prev.delete("page");
      return prev;
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Product List
          </h3>
        </div>
        <div className="border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <div className="rounded-xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <LuSearch size={16} />
                  </button>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  />
                </div>

                <button
                  onClick={handleOpenAdd}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
                >
                  <MdAdd size={20} />
                  Add New Product
                </button>
              </div>
            </div>

            <Table
              columns={TableColumns(handleOpenEdit, handleConfirmationModal)}
              data={products}
              isLoading={isLoading}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>

        {isModalOpen && (modalType === "add" || modalType === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <AddProductModal
                onClose={handleClose}
                selectedProduct={selectedProduct}
              />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && modalType === "delete" && (
        <Modal onClose={handleClose}>
          <DeleteConfirmModal
            product={selectedProduct || undefined}
            onCancel={handleClose}
            onConfirm={() =>
              selectedProduct && handleDeleteConfirm(selectedProduct.id)
            }
          />
        </Modal>
      )}
    </>
  );
};

export default Product;
