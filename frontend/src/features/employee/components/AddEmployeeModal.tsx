import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formatPhoneNumber } from "../../../utils/formatPhone";
import { createEmployee, updateEmployee } from "../api/employee.service";
import { EmployeeFormData, employeeSchema } from "../schemas/employee.schema";
import { IEmployee } from "../types/employee.types";
import { onError, onSuccess } from "@/utils/toast";

interface Iprops {
  onClose: () => void;
  selectedEmployee: IEmployee | null;
}

const positions = [
  "Software Engineer",
  "QA Engineer",
  "Product Manager",
  "HR Manager",
  "Accountant",
  "Sales Executive",
  "UX Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Finance Analyst",
  "Customer Support",
  "Business Analyst",
  "Data Scientist",
  "Product Designer",
  "Technical Lead",
];

const AddEmployeeModal = ({
  onClose,
  selectedEmployee,
}: Iprops) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: selectedEmployee
      ? {
          first_name: selectedEmployee.first_name,
          last_name: selectedEmployee.last_name,
          age: String(selectedEmployee.age),
          salary: String(selectedEmployee.salary),
          start_date: selectedEmployee.start_date
            ? new Date(selectedEmployee.start_date).toISOString().split("T")[0]
            : "",
          position: selectedEmployee.position,
          office: selectedEmployee.office,
          phone: formatPhoneNumber(selectedEmployee.phone),
        }
      : undefined,
  });

  const onSubmit = async (data: EmployeeFormData) => {
    const isEditing = !!selectedEmployee?.id;

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      age: parseInt(data.age),
      salary: parseInt(data.salary),
      start_date: data.start_date,
      position: data.position,
      office: data.office,
      phone: data.phone,
    };

    try {
      if (isEditing) {
        await updateEmployee(selectedEmployee!.id!, payload);
      } else {
        await createEmployee(payload);
      }

      onSuccess(
        isEditing
          ? "Employee updated successfully"
          : "Employee added successfully"
      );
      onClose();
    } catch (error) {
      onError(error, "Failed to save employee");
    }
  };

  const inputClass =
    "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        Personal Information
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            First Name
          </label>
          <input
            type="text"
            placeholder="Firstname"
            {...register("first_name")}
            className={inputClass}
          />
          {errors.first_name && (
            <p className={errorClass}>{errors.first_name.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Lastname"
            {...register("last_name")}
            className={inputClass}
          />
          {errors.last_name && (
            <p className={errorClass}>{errors.last_name.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Age
          </label>
          <input
            type="number"
            placeholder="18"
            {...register("age")}
            className={inputClass}
          />
          {errors.age && <p className={errorClass}>{errors.age.message}</p>}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Salary
          </label>
          <input
            type="number"
            placeholder="123456"
            {...register("salary")}
            className={inputClass}
          />
          {errors.salary && (
            <p className={errorClass}>{errors.salary.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <input
            type="date"
            placeholder=""
            {...register("start_date")}
            className={inputClass}
          />
          {errors.start_date && (
            <p className={errorClass}>{errors.start_date.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Position
          </label>
          <select {...register("position")} className={inputClass}>
            {positions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.position && (
            <p className={errorClass}>{errors.position.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Office
          </label>
          <input
            type="text"
            placeholder="Office"
            {...register("office")}
            className={inputClass}
          />
          {errors.office && (
            <p className={errorClass}>{errors.office.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+09 363 398 46"
            {...register("phone")}
            className={inputClass}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 sm:w-auto"
      >
        Save Changes
      </button>
    </form>
  );
};

export default AddEmployeeModal;
