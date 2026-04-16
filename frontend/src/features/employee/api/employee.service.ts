import { del, get, post, put } from "../../../api/client";
import { IEmployee } from "../types/employee.types";

export const getEmployee = () => {
  return get<IEmployee[]>("/employees");
};

export const createEmployee = (body: {
  first_name: string;
  last_name: string;
  age: number;
  salary: number;
  start_date: string;
  position: string;
  office: string;
  phone: string;
}) => {
  return post<IEmployee>("/employees", body);
};

export const updateEmployee = (
  id: number,
  body: {
    first_name: string;
    last_name: string;
    age: number;
    salary: number;
    start_date: string;
    position: string;
    office: string;
    phone: string;
  }
) => {
  return put<IEmployee>(`/employees/${id}`, body);
};

export const deleteEmployee = (id: number) => {
  return del<IEmployee>(`/employees/${id}`);
};
