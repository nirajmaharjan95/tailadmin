import pool from '../config/db.js';
import { Employee, EmployeeInput } from '../models/employee.model.js';

export const getAllEmployees = async (): Promise<Employee[]> => {
  const result = await pool.query('SELECT * FROM employee');
  return result.rows;
};

export const getEmployeeById = async (id: number): Promise<Employee | null> => {
  const result = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const createEmployee = async (data: EmployeeInput): Promise<Employee> => {
  const { first_name, last_name, position, office, age, start_date, salary, phone } = data;
  const result = await pool.query(
    `INSERT INTO employee (first_name, last_name, position, office, age, start_date, salary, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [first_name, last_name, position, office, age, start_date, salary, phone]
  );
  return result.rows[0];
};

export const updateEmployee = async (id: number, data: EmployeeInput): Promise<Employee | null> => {
  const { first_name, last_name, position, office, age, start_date, salary, phone } = data;
  const result = await pool.query(
    `UPDATE employee SET first_name=$1, last_name=$2, position=$3, office=$4,
     age=$5, start_date=$6, salary=$7, phone=$8 WHERE id=$9 RETURNING *`,
    [first_name, last_name, position, office, age, start_date, salary, phone, id]
  );
  return result.rows[0] ?? null;
};

export const deleteEmployee = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM employee WHERE id=$1 RETURNING *', [id]);
  return result.rows.length > 0;
};
