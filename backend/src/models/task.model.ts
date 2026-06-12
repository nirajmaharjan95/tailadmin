import { z } from 'zod';

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

export const taskStatusEnum = z.enum(['To Do', 'In Progress', 'Completed']);
export const taskTagEnum = z.enum(['Marketing', 'Template', 'Development']);

export const taskSchema = z.object({
  task_title: z.string().min(1, 'Task title is required').max(200),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: taskStatusEnum,
  tags: taskTagEnum,
  description: z.string().max(2000).optional(),
});


export type TaskInput = z.infer<typeof taskSchema>;

export interface Task extends TaskInput {
  id: number;
  created_at: string;
  updated_at: string;
}
