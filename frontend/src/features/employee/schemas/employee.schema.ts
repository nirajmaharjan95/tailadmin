import * as z from "zod";

export const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine(
      (val) =>
        !isNaN(parseInt(val)) && parseInt(val) >= 18 && parseInt(val) <= 100,
      "Age must be between 18 and 100"
    ),
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      "Salary must be a positive number"
    ),
  start_date: z.string().min(1, "Start date is required"),
  position: z.string().min(1, "Position is required"),
  office: z.string().min(1, "Office is required"),
  phone: z
    .string()
    .regex(/^\d{10}$|^\d{3}-\d{3}-\d{4}$/, "Phone must be 10 digits"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
