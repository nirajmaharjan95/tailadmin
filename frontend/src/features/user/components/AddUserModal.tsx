import { useAuth } from "@/features/authentication/hooks/useAuth";
import { onError, onSuccess } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUser, updateUser } from "../api/user.service";
import { buildUserSchema, UserFormData } from "../schemas/user.schema";
import { IUser } from "../types/user.types";
import { UserRole, UserStatus } from "@/features/authentication/types/auth.types";

interface Iprops {
  onClose: () => void;
  selectedUser: IUser | null;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const statusOptions: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DISABLED", label: "Disabled" },
  { value: "LOCKED", label: "Locked" },
];

const AddUserModal = ({ onClose, selectedUser }: Iprops) => {
  const { user: currentUser } = useAuth();
  const isEditing = !!selectedUser;
  const isEditingSelf = isEditing && selectedUser.id === currentUser?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(buildUserSchema(isEditing)),
    defaultValues: selectedUser
      ? {
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          password: "",
          role: selectedUser.role,
          status: selectedUser.status,
        }
      : { password: "", role: "user", status: "ACTIVE" },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing) {
        await updateUser(selectedUser.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          status: data.status,
        });
      } else {
        await createUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
        });
      }

      onSuccess(
        isEditing ? "User updated successfully" : "User added successfully"
      );
      onClose();
    } catch (error) {
      onError(error, "Failed to save user");
    }
  };

  const inputClass =
    "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";
  const errorClass = "mt-1 text-xs text-red-500";
  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400";
  const helperClass = "mt-1 text-xs text-gray-500 dark:text-gray-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
        {isEditing ? "Edit User" : "Add User"}
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1">
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Firstname"
            {...register("firstName")}
            className={inputClass}
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Lastname"
            {...register("lastName")}
            className={inputClass}
          />
          {errors.lastName && (
            <p className={errorClass}>{errors.lastName.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            {...register("email")}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {!isEditing && (
          <div className="col-span-1">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              {...register("password")}
              className={inputClass}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
        )}

        <div className="col-span-1">
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <select
            id="role"
            disabled={isEditingSelf}
            {...register("role")}
            className={inputClass}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          {isEditingSelf && (
            <p className={helperClass}>You cannot change your own role.</p>
          )}
        </div>

        <div className="col-span-1">
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            disabled={isEditingSelf}
            {...register("status")}
            className={inputClass}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className={errorClass}>{errors.status.message}</p>
          )}
          {isEditingSelf && (
            <p className={helperClass}>You cannot change your own status.</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        Save Changes
      </button>
    </form>
  );
};

export default AddUserModal;
