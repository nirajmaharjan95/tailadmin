import { formatDateSmart } from '@/utils/formatDate';
import { Calendar, Check, GripVertical } from 'lucide-react';
import { TaskType } from '../types/task.type';
import { getTagColor } from '../utils/taskBadge';
import MoreOptions from './MoreOptions';

const TaskCard = (props: TaskType) => {
    const { id, task_title, due_date, tags } = props;
    return (
        <div
            draggable="true"
            className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
        >

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start w-full gap-4">
                    <span className="text-gray-400">
                        <GripVertical size={16} />
                    </span>

                    <label
                        htmlFor={String(id)}
                        className="w-full cursor-pointer"
                    >
                        <div className="relative flex items-start">
                            <input
                                type="checkbox"
                                id={String(id)}
                                className="sr-only taskCheckbox"
                            />
                            <div className="flex items-center justify-center w-full h-5 mr-3 border border-gray-300 rounded-md box max-w-5 dark:border-gray-700">
                                <span className="opacity-0">
                                    <Check size={14} />
                                </span>
                            </div>
                            <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                                {task_title}
                            </p>
                        </div>
                    </label>
                </div>

                <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">

                    {tags && (
                        <div className="flex gap-1">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${getTagColor(tags.toLowerCase())}`}>
                                {tags}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between w-full gap-5 xl:w-auto xl:justify-normal">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                                <Calendar size={14} />
                                {formatDateSmart(due_date)}
                            </span>
                        </div>
                    </div>

                    <MoreOptions>
                        {['edit', 'delete']}
                    </MoreOptions>
                </div>
            </div>
        </div>
    )
}

export default TaskCard