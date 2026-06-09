import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import AddProductModal from "@/features/product/components/AddProductModal";
import TableColumns from "@/features/product/components/TableColumns";
import { useProducts } from "@/features/product/hooks/useProducts";
import { LuSearch } from "react-icons/lu";
import { MdAdd } from "react-icons/md";

const Product = () => {
  const {
    products,
    totalCount,
    isLoading,
    isAdmin,
    isModalOpen,
    modalType,
    selectedProduct,
    search,
    pageIndex,
    pageSize,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleConfirmationModal,
    handleDeleteConfirm,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useProducts();
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Product List
            </h2>

            <CustomBreadcrumb />
          </div>
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
                    value={search}
                    onChange={handleSearchChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  />
                </div>

                {isAdmin && (
                  <button
                    onClick={handleOpenAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
                  >
                    <MdAdd size={20} />
                    Add New Product
                  </button>
                )}
              </div>
            </div>

            <Table
              columns={TableColumns(
                handleOpenEdit,
                handleConfirmationModal,
                isAdmin
              )}
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
          <Modal onClose={handleClose}>
            <AddProductModal
              onClose={handleClose}
              selectedProduct={selectedProduct}
            />
          </Modal>
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
