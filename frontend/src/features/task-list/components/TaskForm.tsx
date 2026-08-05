import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { onSuccess } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUsers } from "@/features/user/api/user.service";
import { IUser } from "@/features/user/types/user.types";
import { Calendar, ChevronDown, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createTask } from "../api/task.service";
import { STATUS, TAGS } from "../constants/task.constant";
import useTask from "../hooks/useTask";
import { taskValidation, TaskFormValues } from "../validation/task.validation";
import {
  CreateTaskPayload,
  TaskType,
  UpdateTaskPayload,
} from "../types/task.type";

interface TaskFormProps {
  onClose: () => void;
  editTask?: TaskType;
}

const TaskForm = ({ onClose, editTask }: TaskFormProps) => {
  const { updateTask } = useTask();
  const isEditing = !!editTask;
  const statuses = Object.values(STATUS);
  const tags = Object.values(TAGS);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    getUsers({ limit: 100 })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskValidation),
  });

  useEffect(() => {
    if (editTask) {
      reset({
        task_title: editTask.task_title,
        due_date: editTask.due_date?.split("T")[0] ?? "",
        status: editTask.status,
        tags: editTask.tags,
        description: editTask.description || "",
        assigned_user_id: editTask.assigned_user_id ?? null,
      });
    } else {
      reset({
        task_title: "",
        due_date: "",
        status: "" as CreateTaskPayload["status"],
        tags: "" as CreateTaskPayload["tags"],
        description: "",
        assigned_user_id: null,
      });
    }
  }, [editTask, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const payload: CreateTaskPayload = {
        task_title: data.task_title,
        due_date: data.due_date,
        status: data.status,
        tags: data.tags,
        description: data.description,
        assigned_user_id: data.assigned_user_id ?? null,
      };

      if (isEditing && editTask) {
        const updatePayload: UpdateTaskPayload = { ...payload, id: editTask.id };
        await updateTask(editTask.id, updatePayload);
        onSuccess("Task updated successfully");
      } else {
        await createTask(payload);
        onSuccess("Task added successfully");
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const errorClass = "mt-1 text-xs text-red-500";
  return (
    <div className="no-scrollbar relative w-full overflow-y-auto">
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {isEditing ? "Edit task" : "Add a new task"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {isEditing
            ? "Update the details of your task below"
            : "Effortlessly manage your to-do list: add a new task"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Task Title
              </label>
              <Input type="text" {...register("task_title")} />
              {errors.task_title && (
                <p className={errorClass}>{errors.task_title.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Due Date
              </label>

              <div className="relative">
                <Input
                  id="datepicker"
                  type="date"
                  placeholder="Select date"
                  {...register("due_date")}
                  className="input-date-icon w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <Calendar
                    size={16}
                    className="text-gray-700 dark:text-gray-400"
                  />
                </span>

                {errors.due_date && (
                  <p className={errorClass}>{errors.due_date.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Status
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...register("status")}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="">Select status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                  <ChevronDown size={16} />
                </span>

                {errors.status && (
                  <p className={errorClass}>{errors.status.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Tags
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...register("tags")}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option
                    value=""
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Select tags
                  </option>
                  {tags.map(tag => (
                    <option
                      key={tag}
                      value={tag}
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      {tag}
                    </option>
                  ))}
                </select>
                <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                  <ChevronDown size={16} />
                </span>

                {errors.tags && (
                  <p className={errorClass}>{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Assign User
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...register("assigned_user_id", {
                    setValueAs: (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
                  })}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option value="" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    Unassigned
                  </option>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
                <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                  <User size={16} />
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Description
              </label>
              <textarea
                rows={6}
                {...register("description")}
                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>

              {errors.description && (
                <p className={errorClass}>{errors.description.message}</p>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
              <div className="flex items-center w-full gap-3 sm:w-auto">
                <Button
                  onClick={onClose}
                  variant={"outline"}
                  size={"lg"}
                  className="border-gray-300 bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  size={"lg"}
                  className="bg-brand-500 text-white hover:bg-brand-600"
                >
                  {isEditing ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
