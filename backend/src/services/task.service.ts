import * as taskRepository from '../repositories/task.repository.js';
import { Task, STATUS } from '../types/task.types.js';
import { TaskInput } from '../validations/task.validation.js';

export const getAllTasks = async (limit: number, offset: number, status?: string): Promise<{ data: Task[]; total: number; allCount: number; countsByStatus: Record<string, number> }> => {
  const [dataResult, countResult, allCountResult, todoCount, inProgressCount, completedCount] = await Promise.all([
    taskRepository.findAll(limit, offset, status),
    taskRepository.countByStatusFilter(status),
    taskRepository.countAll(),
    taskRepository.countByStatus(STATUS.TODO),
    taskRepository.countByStatus(STATUS.IN_PROGRESS),
    taskRepository.countByStatus(STATUS.COMPLETED),
  ]);

  return {
    data: dataResult.rows,
    total: Number(countResult.rows[0]?.count ?? 0),
    allCount: allCountResult,
    countsByStatus: {
      todo: Number(todoCount.rows[0]?.count ?? 0),
      in_progress: Number(inProgressCount.rows[0]?.count ?? 0),
      completed: Number(completedCount.rows[0]?.count ?? 0),
    },
  };
};

export const getTaskById = (id: number): Promise<Task | null> => taskRepository.findById(id);

export const createTask = (data: TaskInput): Promise<Task> => taskRepository.insert(data);

export const updateTask = (id: number, data: TaskInput): Promise<Task | null> => taskRepository.update(id, data);

export const deleteTask = (id: number): Promise<boolean> => taskRepository.remove(id);
