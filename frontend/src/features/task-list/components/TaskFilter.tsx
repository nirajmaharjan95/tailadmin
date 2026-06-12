import { Badge } from '@/components/ui/badge';
import { FILTERS } from '../constants/task.constant';
import { FilterOption, TaskType } from '../types/task.type';
import { getStatusColor } from '../utils/taskBadge';

interface TaskFilterProps {
    tasks: TaskType[];
    todoTasks: TaskType[];
    pendingTasks: TaskType[];
    completedTasks: TaskType[];
    activeFilter: FilterOption;
    onFilterChange: (filter: FilterOption) => void;
}

const TaskFilter = (props: TaskFilterProps) => {
    const { tasks, todoTasks, pendingTasks, completedTasks, activeFilter, onFilterChange } = props;

    const countMap: Record<FilterOption, number> = {
        'all': tasks.length,
        'To Do': todoTasks.length,
        'In Progress': pendingTasks.length,
        'Completed': completedTasks.length,
    };

    return (
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {FILTERS.map(({ label, key }) => {
                const isActive = activeFilter === key;
                return (
                    <button
                        key={key}
                        onClick={() => onFilterChange(key)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
                            ${isActive
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {label}
                        <Badge className={`${getStatusColor(key)} border-0`}>
                            {countMap[key]}
                        </Badge>
                    </button>
                );
            })}
        </div>
    );
};

export default TaskFilter;
