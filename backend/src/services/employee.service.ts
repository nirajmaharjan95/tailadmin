import * as employeeRepository from "../repositories/employee.repository.js";
import { Employee } from "../types/employee.types.js";
import { EmployeeInput } from "../validations/employee.validation.js";

export const getAllEmployees = async (
  limit = 10,
  offset = 0,
  search = ""
): Promise<{ data: Employee[]; total: number }> => {
  const pattern = `%${search}%`;
  const [dataResult, countResult] = await Promise.all([
    employeeRepository.findAll(limit, offset, pattern),
    employeeRepository.countAll(pattern),
  ]);
  return { data: dataResult.rows, total: countResult };
};

export const getEmployeeById = (id: number): Promise<Employee | null> => employeeRepository.findById(id);

export const createEmployee = (data: EmployeeInput): Promise<Employee> => employeeRepository.insert(data);

export const updateEmployee = (id: number, data: EmployeeInput): Promise<Employee | null> =>
  employeeRepository.update(id, data);

export const deleteEmployee = (id: number): Promise<boolean> => employeeRepository.remove(id);
