import { onError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { getTasks } from "../api/task.service";
import { TaskType } from "../types/task.type";

const useTask = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const result = await getTasks();
        setTasks(result.data);
      } catch (error) {
        onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [refreshTrigger]);

  return {
    tasks,
    setTasks,
    isLoading,
    refreshTrigger,
    setRefreshTrigger
  };
};

export default useTask;
