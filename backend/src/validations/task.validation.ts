import { z } from 'zod';

export const taskStatusEnum = z.enum(['To Do', 'In Progress', 'Completed']);
export const taskTagEnum = z.enum(['Marketing', 'Template', 'Development']);

export const taskSchema = z.object({
  task_title: z.string().min(1, 'Task title is required').max(200),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  status: taskStatusEnum,
  tags: taskTagEnum,
  description: z.string().max(2000).optional(),
  assigned_user_id: z.number().int().positive().nullable().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
