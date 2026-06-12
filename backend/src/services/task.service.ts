import pool from '../config/db.js';
import { Task, TaskInput } from '../models/task.model.js';

export const getAllTasks = async (): Promise<Task[]> => {
  const result = await pool.query(`SELECT * FROM task ORDER BY id DESC`);
  return result.rows;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const result = await pool.query('SELECT * FROM task WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const createTask = async (data: TaskInput): Promise<Task> => {
  const { task_title, due_date, status, tags, description } = data;
  const result = await pool.query(
    `INSERT INTO task (task_title, due_date, status, tags, description)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [task_title, due_date, status, tags, description ?? null]
  );
  return result.rows[0];
};

export const updateTask = async (id: number, data: TaskInput): Promise<Task | null> => {
  const { task_title, due_date, status, tags, description } = data;
  const result = await pool.query(
    `UPDATE task
     SET task_title=$1, due_date=$2, status=$3, tags=$4, description=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [task_title, due_date, status, tags, description ?? null, id]
  );
  return result.rows[0] ?? null;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM task WHERE id=$1 RETURNING *', [id]);
  return result.rows.length > 0;
};
