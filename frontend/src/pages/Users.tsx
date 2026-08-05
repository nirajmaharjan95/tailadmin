import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ExportDownloadButton from "@/components/ExportDownloadButton";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import AddUserModal from "@/features/user/components/AddUserModal";
import TableColumns from "@/features/user/components/TableColumns";
import { useUsers } from "@/features/user/hooks/useUsers";
import { LuSearch } from "react-icons/lu";
import { MdAdd } from "react-icons/md";

const Users = () => {
  // AdminRoute already guarantees an admin visitor; the current user id is
  // only needed to hide the self-delete action.
  const { user: currentUser } = useAuth();

  const {
    users,
    totalCount,
    isLoading,
    pageIndex,
    pageSize,
    search,
    modalType,
    selectedUser,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleOpenAdd,
    onEdit,
    handleClose,
    onDelete,
    handleModalSave,
    handleDeleteConfirm,
  } = useUsers();

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Users
            </h2>

            <CustomBreadcrumb />
          </div>
        </div>

        <div className="border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <div className="rounded-xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
                  >
                    <LuSearch size={16} />
                  </Button>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <ExportDownloadButton
                    variant="multi"
                    options={["csv", "pdf", "xlsx"]}
                    data={users}
                    filename="users"
                    excludeFields={["id"]}
                  />

                  <Button onClick={handleOpenAdd} variant="default" size={"lg"}>
                    <MdAdd size={20} />
                    Add New User
                  </Button>
                </div>
              </div>
            </div>

            <Table
              data={users}
              columns={TableColumns(onEdit, onDelete, currentUser?.id)}
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
          <AddUserModal
            key={selectedUser?.id ?? "new"}
            onClose={handleModalSave}
            selectedUser={selectedUser}
          />
        </Modal>
      )}

      {modalType === "delete" && selectedUser && (
        <Modal onClose={handleClose}>
          <DeleteConfirmModal
            user={selectedUser}
            onCancel={handleClose}
            onConfirm={handleDeleteConfirm}
          />
        </Modal>
      )}
    </>
  );
};

export default Users;
