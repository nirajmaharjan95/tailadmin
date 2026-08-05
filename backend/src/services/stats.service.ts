import * as courseRepository from "../repositories/course.repository.js";
import * as employeeRepository from "../repositories/employee.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import * as taskRepository from "../repositories/task.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { DashboardStats } from "../types/dashboard.types.js";

// The three metrics every role sees. Fetched together in parallel.
const getSharedStats = async () => {
  const [employees, products, tasks] = await Promise.all([
    employeeRepository.countAllRows(),
    productRepository.countAllRows(),
    taskRepository.countAll(),
  ]);

  return {
    employees: { total: employees },
    products: { total: products },
    tasks: { total: tasks },
  };
};

export const getStats = async (isAdmin: boolean): Promise<DashboardStats> => {
  const sharedStatsPromise = getSharedStats();

  if (isAdmin) {
    // user.repository.countAllRows unwraps the row and returns a number.
    const [sharedStats, userCount] = await Promise.all([sharedStatsPromise, userRepository.countAllRows()]);

    return { ...sharedStats, users: { total: userCount } };
  }

  const [sharedStats, courseCount] = await Promise.all([sharedStatsPromise, courseRepository.countAllRows()]);

  return { ...sharedStats, courses: { total: courseCount } };
};
