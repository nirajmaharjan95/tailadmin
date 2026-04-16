import useDebounce from "@/hooks/useDebounce";
import { ModalType } from "@/types/Types";
import { onError, onSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteEmployee, getEmployee } from "../api/employee.service";
import { IEmployee } from "../types/employee.types";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );

  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    try {
      setIsLoading(true);
      const fetchEmployees = async () => {
        const result = await getEmployee({
          limit: pageSize,
          offset: pageIndex * pageSize,
          search: debouncedSearch,
        });
        setEmployees(result.data);
        setTotalCount(result.total);
      };

      fetchEmployees();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, pageIndex, debouncedSearch, refreshTrigger]);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams((prev) => {
      prev.set("page", (newPageIndex + 1).toString());
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", newPageSize.toString());
      prev.set("page", "1");
      return prev;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee?.id) return;
    try {
      setIsLoading(true);
      await deleteEmployee(selectedEmployee.id);
      onSuccess("Employee deleted successfully");
      setSelectedEmployee(null);
      const result = await getEmployee({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
      });
      setEmployees(result.data);
      setTotalCount(result.total);
    } catch (error) {
      onError(error, "Failed to delete employee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const value = e.target.value;
      prev.set("search", value);
      prev.delete("page");
      return prev;
    });
  };

  const onEdit = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setModalType("edit");
  };

  const onDelete = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setModalType("delete");
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setModalType("add");
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setModalType(null);
  };

  const handleModalSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    handleClose();
  };

  return {
    employees,
    isLoading,
    pageIndex,
    pageSize,
    search,
    modalType,
    totalCount,
    selectedEmployee,
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
