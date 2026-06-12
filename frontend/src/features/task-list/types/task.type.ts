import { STATUS, TAGS } from "../constants/task.constant";

export type FilterOption = TASK_STATUS | 'all';
export type TASK_TAGS = (typeof TAGS)[keyof typeof TAGS];
export type TASK_STATUS = (typeof STATUS)[keyof typeof STATUS];

export interface TaskType {
  id: number;
  task_title: string;
  due_date: string;
  status: TASK_STATUS;
  description?: string;
  tags: TASK_TAGS;
  created_at?: string;
  updated_at?: string;
}

export type CreateTaskPayload = Omit<TaskType, 'id' | 'created_at' | 'updated_at'>
export interface UpdateTaskPayload extends CreateTaskPayload {
  id: number;
}
