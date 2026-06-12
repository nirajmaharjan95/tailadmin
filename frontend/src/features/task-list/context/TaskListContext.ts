import { createContext, Dispatch, SetStateAction } from "react";
import { TaskType, UpdateTaskPayload } from "../types/task.type";

export interface TaskContextType {
   tasks: TaskType[];
   setTasks: Dispatch<SetStateAction<TaskType[]>>;
   showModal: boolean;
   setShowModal: Dispatch<SetStateAction<boolean>>;
   editTaskId: number | null;
   setEditTaskId: Dispatch<SetStateAction<number | null>>;
   total: number;
   setTotal: Dispatch<SetStateAction<number>>;
   allCount: number;
   setAllCount: Dispatch<SetStateAction<number>>;
   countsByStatus: Record<string, number> | undefined;
   setCountsByStatus: Dispatch<SetStateAction<Record<string, number> | undefined>>;
   deleteTask: (id: number) => Promise<void>;
   updateTask: (id: number, payload: UpdateTaskPayload) => Promise<void>;
 }

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
