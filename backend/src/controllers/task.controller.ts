import { Request, Response } from 'express';
import { taskSchema } from '../models/task.model.js';
import * as taskService from '../services/task.service.js';

const parseErrors = (issues: Array<{ path: PropertyKey[]; message: string }>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path.join('.')] = issue.message;
    return acc;
  }, {});

export const getAll = async (_req: Request, res: Response) => {
  try {
    const data = await taskService.getAllTasks();
    res.json({ data });
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch {
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    res.status(201).json(await taskService.createTask(parsed.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: 'Failed to create task.', detail: message });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    const task = await taskService.updateTask(Number(req.params.id), parsed.data);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch {
    res.status(400).json({ error: 'Failed to update task.' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await taskService.deleteTask(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};
