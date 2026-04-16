import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import AddEmployeeModal from "@/features/employee/components/AddEmployeeModal";
import TableColumns from "@/features/employee/components/TableColumns";
import { useEmployees } from "@/features/employee/hooks/useEmployees";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { LuSearch } from "react-icons/lu";
import { MdAdd } from "react-icons/md";

const Employees = () => {
  const isAdmin = useIsAdmin();

  const {
    employees,
    totalCount,
    isLoading,
    pageIndex,
    pageSize,
    search,
    modalType,
    selectedEmployee,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleOpenAdd,
    onEdit,
    handleClose,
    onDelete,
    handleModalSave,
    handleDeleteConfirm,
  } = useEmployees();

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Employee List
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
                    Add New Employee
                  </button>
                )}
              </div>
            </div>

            <Table
              data={employees}
              columns={TableColumns(onEdit, onDelete, isAdmin)}
              isLoading={isLoading}
              pageSize={pageSize}
              pageIndex={pageIndex}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>

      {(modalType === "add" || modalType === "edit") && (
        <Modal onClose={handleClose}>
          <AddEmployeeModal
            key={selectedEmployee?.id ?? "new"}
            onClose={handleModalSave}
            selectedEmployee={selectedEmployee}
          />
        </Modal>
      )}

      {modalType === "delete" && selectedEmployee && (
        <Modal onClose={handleClose}>
          <DeleteConfirmModal
            employee={selectedEmployee}
            onCancel={handleClose}
            onConfirm={handleDeleteConfirm}
          />
        </Modal>
      )}
    </>
  );
};

export default Employees;
