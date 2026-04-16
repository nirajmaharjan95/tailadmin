import { z } from 'zod';

export const employeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  position: z.string().min(1, 'Position is required').max(100),
  office: z.string().min(1, 'Office is required').max(100),
  age: z.coerce.number().int().min(18, 'Age must be at least 18').max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  salary: z.coerce.number().positive('Salary must be a positive number'),
  phone: z.string().regex(/^\d{10}$|^\d{3}-\d{3}-\d{4}$/, 'Phone must be 10 digits'),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

export interface Employee extends EmployeeInput {
  id: number;
}
