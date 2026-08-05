import pool from "../config/db.js";
import { Task, STATUS } from "../types/task.types.js";
import { TaskInput } from "../validations/task.validation.js";

const SELECT_WITH_USER = `
  SELECT 
    t.*,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name,
    u.email AS assigned_user_email
  FROM task t
  LEFT JOIN users u ON t.assigned_user_id = u.id
`;

export const findAll = (limit: number, offset: number, status?: string) =>
  status
    ? pool.query(`${SELECT_WITH_USER} WHERE t.status = $3 ORDER BY t.id DESC LIMIT $1 OFFSET $2`, [limit, offset, status])
    : pool.query(`${SELECT_WITH_USER} ORDER BY t.id DESC LIMIT $1 OFFSET $2`, [limit, offset]);

export const countByStatusFilter = (status?: string) =>
  status
    ? pool.query(`SELECT COUNT(*)::int AS count FROM task WHERE status = $1`, [status])
    : pool.query(`SELECT COUNT(*)::int AS count FROM task`);

export const countAll = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*)::int AS count FROM task`);
  return Number(result.rows[0]?.count ?? 0);
};

export const countByStatus = (status: (typeof STATUS)[keyof typeof STATUS]) =>
  pool.query(`SELECT COUNT(*)::int AS count FROM task WHERE status = $1`, [status]);

export const findById = async (id: number): Promise<Task | null> => {
  const result = await pool.query(`${SELECT_WITH_USER} WHERE t.id = $1`, [id]);
  return result.rows[0] ?? null;
};

export const insert = async (data: TaskInput): Promise<Task> => {
  const { task_title, due_date, status, tags, description, assigned_user_id } = data;
  const result = await pool.query(
    `INSERT INTO task (task_title, due_date, status, tags, description, assigned_user_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [task_title, due_date, status, tags, description ?? null, assigned_user_id ?? null]
  );
  return findById(result.rows[0].id) as Promise<Task>;
};

export const update = async (id: number, data: TaskInput): Promise<Task | null> => {
  const { task_title, due_date, status, tags, description, assigned_user_id } = data;
  const result = await pool.query(
    `UPDATE task
     SET task_title=$1, due_date=$2, status=$3, tags=$4, description=$5, assigned_user_id=$6, updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [task_title, due_date, status, tags, description ?? null, assigned_user_id ?? null, id]
  );
  if (!result.rows[0]) return null;
  return findById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM task WHERE id=$1 RETURNING *", [id]);
  return result.rows.length > 0;
};
