import { Badge } from "@/components/ui/badge";
import { TaskType } from "../types/task.type";
import { getStatusColor } from "../utils/taskBadge";
import MoreOptions from "./MoreOptions";
import TaskCard from "./TaskCard";

interface TaskGroupType {
    title: string;
    tasks: TaskType[];
}

const TaskGroup = (props: TaskGroupType) => {
    const { title, tasks } = props;
    const badgeClass = getStatusColor(title);

    return (
        <div className="flex flex-col gap-4 swim-lane">
            <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                    {title}
                    <Badge className={`${badgeClass} border-0`}>
                        {tasks.length}
                    </Badge>
                </h3>

                <MoreOptions>
                    {['Edit', 'Delete', 'Clear All']}
                </MoreOptions>
            </div>

            <div className="flex flex-col gap-4">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} {...task} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
                )}
            </div>
        </div>
    )
}

export default TaskGroup