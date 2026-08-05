import pool from "../config/db.js";
import { Employee } from "../types/employee.types.js";

export interface EmployeeData {
  first_name: string;
  last_name: string;
  position: string;
  office: string;
  age: number;
  start_date: string;
  salary: number;
  phone: string;
}

export const findAll = (limit: number, offset: number, pattern: string) =>
  pool.query(
    `SELECT * FROM employee
     WHERE first_name ILIKE $3 OR last_name ILIKE $3 OR position ILIKE $3 OR office ILIKE $3
     ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset, pattern]
  );

// Count all products matching the pattern (search term) for pagination purposes.
export const countAll = async (pattern: string): Promise<number> => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM employee WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR position ILIKE $1 OR office ILIKE $1`,
    [pattern]
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const countAllRows = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM employee`);
  return Number(result.rows[0]?.count ?? 0);
};

export const findById = async (id: number): Promise<Employee | null> => {
  const result = await pool.query("SELECT * FROM employee WHERE id = $1", [id]);
  return result.rows[0] ?? null;
};

export const insert = async (data: EmployeeData): Promise<Employee> => {
  const { first_name, last_name, position, office, age, start_date, salary, phone } = data;
  const result = await pool.query(
    `INSERT INTO employee (first_name, last_name, position, office, age, start_date, salary, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [first_name, last_name, position, office, age, start_date, salary, phone]
  );
  return result.rows[0];
};

export const update = async (id: number, data: EmployeeData): Promise<Employee | null> => {
  const { first_name, last_name, position, office, age, start_date, salary, phone } = data;
  const result = await pool.query(
    `UPDATE employee SET first_name=$1, last_name=$2, position=$3, office=$4,
     age=$5, start_date=$6, salary=$7, phone=$8 WHERE id=$9 RETURNING *`,
    [first_name, last_name, position, office, age, start_date, salary, phone, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM employee WHERE id=$1 RETURNING *", [id]);
  return result.rows.length > 0;
};
