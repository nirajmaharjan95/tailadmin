import { Request, Response } from 'express';
import { employeeSchema } from '../models/employee.model.js';
import * as employeeService from '../services/employee.service.js';

const parseErrors = (issues: Array<{ path: PropertyKey[]; message: string }>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path.join('.')] = issue.message;
    return acc;
  }, {});

export const getAll = async (_req: Request, res: Response) => {
  try {
    res.json(await employeeService.getAllEmployees());
  } catch {
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const employee = await employeeService.getEmployeeById(Number(req.params.id));
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch {
    res.status(500).json({ error: 'Failed to fetch employee.' });
  }
};

export const create = async (req: Request, res: Response) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    res.status(201).json(await employeeService.createEmployee(parsed.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: 'Failed to create employee.', detail: message });
  }
};

export const update = async (req: Request, res: Response) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parseErrors(parsed.error.issues) });
    return;
  }
  try {
    const employee = await employeeService.updateEmployee(Number(req.params.id), parsed.data);
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch {
    res.status(400).json({ error: 'Failed to update employee.' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await employeeService.deleteEmployee(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted successfully.' });
  } catch {
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
};
