import useDebounce from "@/hooks/useDebounce";
import { ModalType } from "@/types/types";
import { onError, onSuccess } from "@/utils/toast";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteUser, getUsers } from "../api/user.service";
import { IUser } from "../types/user.types";

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  console.log("🚀 ~ useUsers ~ selectedUser:", selectedUser);

  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  // try/catch/finally lives inside the async function so the loading state
  // only clears once the request settles and rejections are surfaced.
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUsers({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
      });
      setUsers(result.data);
      setTotalCount(result.total);
    } catch (error) {
      onError(error, "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, pageIndex, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams(prev => {
      prev.set("page", (newPageIndex + 1).toString());
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams(prev => {
      prev.set("pageSize", newPageSize.toString());
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      prev.set("search", e.target.value);
      prev.delete("page");
      return prev;
    });
  };

  const handleClose = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setIsLoading(true);
      await deleteUser(selectedUser.id);
      onSuccess("User deleted successfully");
      handleClose();
      await fetchUsers();
    } catch (error) {
      onError(error, "Failed to delete user");
      setIsLoading(false);
    }
  };

  const onEdit = (user: IUser) => {
    setSelectedUser(user);
    setModalType("edit");
  };

  const onDelete = (user: IUser) => {
    setSelectedUser(user);
    setModalType("delete");
  };

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setModalType("add");
  };

  const handleModalSave = () => {
    setRefreshTrigger(prev => prev + 1);
    handleClose();
  };

  return {
    users,
    isLoading,
    pageIndex,
    pageSize,
    search,
    modalType,
    totalCount,
    selectedUser,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteConfirm,
    handleSearchChange,
    onEdit,
    onDelete,
    handleOpenAdd,
    handleClose,
    handleModalSave,
  };
};
