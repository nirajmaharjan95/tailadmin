import { createColumnHelper } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { LuChevronDown, LuPencil, LuSearch, LuTrash2 } from 'react-icons/lu'
import { MdAdd } from 'react-icons/md'
import Table from './Table'
import Modal from './Modal'
import AddEmployeeModal from './AddEmployeeModal'

export interface IAddEmployeeForm {
  name: string
  first_name: string
  last_name: string
  age: number
  email: string
  position: string
  office: string
  phone: string
  address: string
  salary: string
  avatar: FileList
  actions: string
}

const columnHelper = createColumnHelper<IAddEmployeeForm>()

const columns = [
  columnHelper.accessor('name', {
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
      )
    },
  }),

  columnHelper.accessor('age', {
    header: () => <span>age</span>,
  }),
  columnHelper.accessor('position', {
    header: () => <span>Position</span>,
  }),
  columnHelper.accessor('office', {
    header: () => <span>Office</span>,
  }),
  columnHelper.accessor('salary', {
    header: () => <span>Salary</span>,
  }),

  columnHelper.accessor('phone', {
    header: () => <span>Phone</span>,
  }),

  columnHelper.accessor('actions', {
    header: () => <span>Actions</span>,
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
          <LuPencil size={18} />
        </button>
        <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
          <LuTrash2 size={18} />
        </button>
      </div>
    ),
  }),
]

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<IAddEmployeeForm[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/employees')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }
  const handleModalOpen = () => {
    setIsModalOpen(true)
  }
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Employee List
          </h3>
        </div>
        <div className="border-t border-gray-100 p-5 dark:border-gray-800 sm:p-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400"> Show </span>
                <div className="relative z-20 bg-transparent">
                  <select className="dark:bg-dark-900 h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none py-2 pl-3 pr-8 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option
                      value="10"
                      className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                    >
                      10
                    </option>
                    <option
                      value="8"
                      className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                    >
                      8
                    </option>
                    <option
                      value="5"
                      className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                    >
                      5
                    </option>
                  </select>
                  <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <LuChevronDown size={16} />
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  entries
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <LuSearch size={16} />
                  </button>

                  <input
                    type="text"
                    x-model="search"
                    placeholder="Search..."
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

            <Table data={employees} columns={columns} />
            {isModalOpen && (
              <Modal onClose={handleModalClose}>
                <AddEmployeeModal
                  setEmployees={setEmployees}
                  setIsModalOpen={setIsModalOpen}
                />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployeeTable
