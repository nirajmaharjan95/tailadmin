import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import Modal from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import TaskForm from "@/features/task-list/components/TaskForm";
import TaskGroup from "@/features/task-list/components/TaskGroup";
import { STATUS } from "@/features/task-list/constants/task.constant";
import useTask from "@/features/task-list/hooks/useTask";
import { FilterOption } from "@/features/task-list/types/task.type";
import { getStatusColor } from "@/features/task-list/utils/taskBadge";
import { Plus } from "lucide-react";
import { useState } from "react";


interface Tab {
  key: FilterOption;
  label: string;
  statusColor: string;
  count: () => number;
}

const TaskList = () => {
  const { tasks, setRefreshTrigger } = useTask();
  const [activeTab, setActiveTab] = useState<FilterOption>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todoTasks = tasks.filter((task) => task.status === STATUS.TODO);
  const inprogressTasks = tasks.filter((task) => task.status === STATUS.IN_PROGRESS);
  const completedTasks = tasks.filter((task) => task.status === STATUS.COMPLETED);

  const tabs: Tab[] = [
    { key: 'all', label: 'All Tasks', statusColor: getStatusColor('all'), count: () => tasks.length },
    { key: STATUS.TODO, label: 'To Do', statusColor: getStatusColor(STATUS.TODO), count: () => todoTasks.length },
    { key: STATUS.IN_PROGRESS, label: 'In Progress', statusColor: getStatusColor(STATUS.IN_PROGRESS), count: () => inprogressTasks.length },
    { key: STATUS.COMPLETED, label: 'Completed', statusColor: getStatusColor(STATUS.COMPLETED), count: () => completedTasks.length },
  ];

  const handleShowModal = () => {
    setIsModalOpen(true);
  }
  const handleModalSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsModalOpen(false);
  }
  const handleModalClose = () => {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Task List
          </h2>

          <CustomBreadcrumb />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
          <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white ${activeTab === tab.key
                    ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  {tab.label}
                  <Badge className={tab.statusColor}>{tab.count()}</Badge>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <button onClick={handleShowModal} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                Add New Task
                <Plus size={16} />
              </button>
            </div>

            {isModalOpen && (
              <Modal onClose={handleModalClose}>
                <TaskForm onClose={handleModalSave} />
              </Modal>
            )}
          </div>

        </div>
        <div className="p-4 space-y-8 border-t border-gray-200 mt-7 dark:border-gray-800 sm:mt-0 xl:p-6">
          {(activeTab === 'all' || activeTab === STATUS.TODO) && (
            <TaskGroup title="To Do" tasks={todoTasks} />
          )}
          {(activeTab === 'all' || activeTab === STATUS.IN_PROGRESS) && (
            <TaskGroup title="In Progress" tasks={inprogressTasks} />
          )}
          {(activeTab === 'all' || activeTab === STATUS.COMPLETED) && (
            <TaskGroup title="Completed" tasks={completedTasks} />
          )}
        </div>
      </div>
    </>
  );
};

export default TaskList;
