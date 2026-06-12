import { z } from "zod";
import { STATUS, TAGS } from "../constants/task.constant";

const statusValues = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.COMPLETED] as const;
const tagValues = [TAGS.MARKETING, TAGS.TEMPLATE, TAGS.DEVELOPMENT] as const;

export const taskValidation = z.object({
    task_title: z.string().min(3, "Task title is required."),
    due_date: z.string().min(1, "Due Date is required."),
    status: z.enum(statusValues),
    tags: z.enum(tagValues),
    description: z.string().optional()
})
