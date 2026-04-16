import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import { MdAdd } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import Modal from "../../../components/Modal";
import Table from "../../../components/Table";
import { formatDate } from "../../../utils/formatDate";
import { formatPhoneNumber } from "../../../utils/formatPhone";
import { deleteEmployee, getEmployee } from "../api/employee.service";
import { IEmployee } from "../types/employee.types";
import AddEmployeeModal from "./AddEmployeeModal";

const columnHelper = createColumnHelper<IEmployee>();

const widthConfig = {
  name: 200,
  age: 80,
  position: 100,
  office: 150,
  startDate: 150,
  action: 80,
};

const getColumns = (
  handleEdit: (row: IEmployee) => void,
  handleDeleteClick: (row: IEmployee) => void
) => [
  columnHelper.accessor("name", {
    header: () => <span>Name</span>,
    sortingFn: (rowA, rowB) => {
      const a = `${rowA.original.first_name} ${rowA.original.last_name}`;
      const b = `${rowB.original.first_name} ${rowB.original.last_name}`;
      return a.localeCompare(b);
    },
    cell: (info) => {
      return (
        <>
          <p className="block text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {`${info.row.original.first_name}  ${info.row.original.last_name}`}
          </p>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {info.row.original.email}
          </span>
        </>
      );
    },
    size: widthConfig.name,
  }),

  columnHelper.accessor("age", {
    header: () => <span>Age</span>,
  }),
  columnHelper.accessor("position", {
    header: () => <span>Position</span>,
  }),
  columnHelper.accessor("office", {
    header: () => <span>Office</span>,
  }),
  columnHelper.accessor("start_date", {
    header: () => <span>Start Date</span>,
    cell: (info) => {
      return formatDate(info.getValue());
    },
  }),
  columnHelper.accessor("salary", {
    header: () => <span>Salary</span>,
  }),

  columnHelper.accessor("phone", {
    header: () => <span>Phone</span>,
    cell: (info) => {
      return <span>{formatPhoneNumber(info.getValue())}</span>;
    },
  }),

  columnHelper.accessor("actions", {
    header: () => <span>Actions</span>,
    enableSorting: false,
    cell: (info) => {
      const rowData = info.row.original;
      return (
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
            onClick={() => handleEdit(rowData)}
          >
            <LuPencil size={18} />
          </button>
          <button
            className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
            onClick={() => handleDeleteClick(rowData)}
          >
            <LuTrash2 size={18} />
          </button>
        </div>
      );
    },
    size: widthConfig.action,
  }),
];

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployee();
      setEmployees(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Table ma dekhine data employees state bata indirectly aaucha
  //searchTerm khali cha bhane usually: return true huncha // or no filtering effect
  const filteredData = useMemo(() => {
    if (!query) {
      return employees;
    }

    return employees.filter((employee) => {
      const searchableText = `
     ${employee.first_name}
      ${employee.last_name}
      ${employee.position}
      ${employee.office}
      ${employee.age}
      ${employee.phone}
      ${employee.salary}
     `;
      return searchableText.toLowerCase().includes(query.toLowerCase());
    });
  }, [employees, query]);

  const handleModalClose = () => {
    setSelectedEmployee(null);
    setIsEditOpen(false);
  };

  const handleModalOpen = () => {
    setSelectedEmployee(null);
    setIsEditOpen(true);
  };

  const handleEdit = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee?.id) return;
    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setSelectedEmployee(null);
    }
  };

  const columns = getColumns(handleEdit, handleDeleteClick);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

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
                    onChange={handleSearchInputChange}
                    value={query}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  />
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
                  onClick={handleModalOpen}
                >
                  <MdAdd size={20} />
                  Add New Employee
                </button>
              </div>
            </div>

            <Table
              data={filteredData}
              columns={columns}
              isPaginationVisible={true}
              isLoading={isLoading}
            />

            {isEditOpen && (
              <Modal onClose={handleModalClose}>
                <AddEmployeeModal
                  key={selectedEmployee?.id ?? "new"}
                  setEmployees={setEmployees}
                  onClose={handleModalClose}
                  selectedEmployee={selectedEmployee}
                />
              </Modal>
            )}

            {!isEditOpen && selectedEmployee && (
              <Modal onClose={() => setSelectedEmployee(null)}>
                <DeleteConfirmModal
                  employee={selectedEmployee}
                  onConfirm={handleDeleteConfirm}
                  onCancel={() => setSelectedEmployee(null)}
                />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
