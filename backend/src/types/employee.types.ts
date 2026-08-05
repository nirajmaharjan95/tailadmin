import { EmployeeData } from '../repositories/employee.repository.js';

export interface Employee extends EmployeeData {
  id: number;
}
