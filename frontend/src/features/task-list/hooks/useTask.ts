import { onError } from "@/utils/toast";
import { useContext, useEffect, useRef, useState } from "react";
import { getTasks } from "../api/task.service";
import { TaskContext } from "../context/TaskListContext";
import { FilterOption } from "../types/task.type";

export const PAGE_SIZE = 100;

const useTask = (status?: FilterOption) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isFetchingRef = useRef(false);

  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }

  const { tasks, setTasks, total, setTotal, allCount, setAllCount, countsByStatus, setCountsByStatus, showModal, setShowModal, editTaskId, setEditTaskId, deleteTask, updateTask } = context;

useEffect(() => {
     const fetchTasks = async () => {
       try {
         isFetchingRef.current = true;
         setIsLoading(true);
         const result = await getTasks({ limit: PAGE_SIZE, offset: 0, status: status === 'all' ? undefined : status });
         setTasks(result.data);
         setTotal(result.total);
         setAllCount(result.allCount);
         setCountsByStatus(result.countsByStatus);
       } catch (error) {
         onError(error);
       } finally {
         setIsLoading(false);
         isFetchingRef.current = false;
       }
     };

     fetchTasks();
   }, [refreshTrigger, status, setTasks, setTotal, setAllCount, setCountsByStatus]);

  const hasMore = tasks.length < total;

const loadMoreTasks = async () => {
     if (isFetchingRef.current || !hasMore) return;

     try {
       isFetchingRef.current = true;
       setIsLoadingMore(true);
       const result = await getTasks({ limit: PAGE_SIZE, offset: tasks.length, status: status === 'all' ? undefined : status });
       setTasks((prev) => [...prev, ...result.data]);
       setTotal(result.total);
       setAllCount(result.allCount);
       setCountsByStatus(result.countsByStatus);
     } catch (error) {
       onError(error);
     } finally {
       setIsLoadingMore(false);
       isFetchingRef.current = false;
     }
   };

  return {
    tasks,
    setTasks,
    isLoading,
    isLoadingMore,
    hasMore,
    total,
    allCount,
    countsByStatus,
    loadMoreTasks,
    refreshTrigger,
    setRefreshTrigger,
    showModal,
    setShowModal,
    editTaskId,
    setEditTaskId,
    deleteTask,
    updateTask,
  };
};

export default useTask;