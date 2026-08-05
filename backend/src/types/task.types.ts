import { TaskInput } from '../validations/task.validation.js';

export const STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const TAGS = {
  MARKETING: 'Marketing',
  TEMPLATE: 'Template',
  DEVELOPMENT: 'Development'
} as const

export type TASK_TAGS = (typeof TAGS)[keyof typeof TAGS];
export type TASK_STATUS = (typeof STATUS)[keyof typeof STATUS];

export interface Task extends TaskInput {
  id: number;
  assigned_user_id?: number | null;
  assigned_user_name?: string | null;
  assigned_user_email?: string | null;
  created_at: string;
  updated_at: string;
}
