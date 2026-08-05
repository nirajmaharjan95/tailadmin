import { ReactNode, useCallback, useState } from "react";
import { TaskType, UpdateTaskPayload } from "../types/task.type";
import { TaskContext } from "./TaskListContext";
import * as taskApi from "../api/task.service";
import { onError, onSuccess } from "@/utils/toast";

const TaskListProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [countsByStatus, setCountsByStatus] = useState<
    Record<string, number> | undefined
  >(undefined);

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        const taskToDelete = tasks.find(task => task.id === id);
        await taskApi.deleteTask(id);
        setTasks(prev => prev.filter(task => task.id !== id));
        setTotal(prev => Math.max(0, prev - 1));
        setAllCount(prev => Math.max(0, prev - 1));
        if (taskToDelete) {
          setCountsByStatus(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              [taskToDelete.status]: Math.max(
                0,
                (prev[taskToDelete.status] || 0) - 1
              ),
            };
          });
        }
        onSuccess("Task deleted successfully");
      } catch (error) {
        onError(error);
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id: number, payload: UpdateTaskPayload) => {
      try {
        const updatedTask = await taskApi.updateTask(id, payload);
        const oldTask = tasks.find(task => task.id === id);
        setTasks(prev =>
          prev.map(task => (task.id === id ? updatedTask : task))
        );
        if (oldTask && oldTask.status !== updatedTask.status) {
          setCountsByStatus(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              [oldTask.status]: Math.max(0, (prev[oldTask.status] || 0) - 1),
              [updatedTask.status]: (prev[updatedTask.status] || 0) + 1,
            };
          });
        }
      } catch (error) {
        onError(error);
      }
    },
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        showModal,
        setShowModal,
        editTaskId,
        setEditTaskId,
        total,
        setTotal,
        allCount,
        setAllCount,
        countsByStatus,
        setCountsByStatus,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskListProvider;
