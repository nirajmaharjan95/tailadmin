import { del, get, post, put } from "@/api/client";
import { TaskType, CreateTaskPayload, UpdateTaskPayload } from "../types/task.type";

export const getTasks = (params: { limit: number; offset: number; status?: string }) =>
  get<{ data: TaskType[]; total: number; allCount: number; countsByStatus: Record<string, number> }>("/tasks", params);

export const createTask = (body: CreateTaskPayload) => {
  return post<TaskType>("/tasks", body);
};

export const updateTask = (id: number, body: UpdateTaskPayload) => {
  return put<TaskType>(`/tasks/${id}`, body);
};

export const deleteTask = (id: number) => {
  return del<TaskType>(`/tasks/${id}`);
};
