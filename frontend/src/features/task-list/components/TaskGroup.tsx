import { Dispatch, SetStateAction, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { FilterOption, TaskType } from "../types/task.type";
import { getStatusColor } from "../utils/taskBadge";
import { useVirtualizer } from '@tanstack/react-virtual';
import TaskCard from "./TaskCard";


interface TaskGroupType {
    title: string;
    tasks: TaskType[];
    setShowModal: Dispatch<SetStateAction<boolean>>;
    setEditTaskId: Dispatch<SetStateAction<number | null>>;
    deleteTask: (id: number) => Promise<void>;
    activeTab: FilterOption;
    setActiveTab: Dispatch<SetStateAction<FilterOption>>;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
    totalCount?: number;
}

const MAX_NUMBER_OF_TASKS_TO_DISPLAY = 3;
const SCROLL_LOAD_MORE_THRESHOLD_PX = 200;

const TaskGroup = (props: TaskGroupType) => {
    const { title, tasks, setShowModal, setEditTaskId, deleteTask, activeTab, setActiveTab, onLoadMore, hasMore, isLoadingMore, totalCount } = props;
    const badgeClass = getStatusColor(title);

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: activeTab === 'all' ? 0 : tasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 115,
        overscan: 5,
    })

    const handleViewAll = () => {
        setActiveTab(title as FilterOption);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!hasMore || isLoadingMore) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < SCROLL_LOAD_MORE_THRESHOLD_PX) {
            onLoadMore();
        }
    };


    const fewTasks = tasks.slice(0, MAX_NUMBER_OF_TASKS_TO_DISPLAY);
    const showViewAllButton = tasks.length > MAX_NUMBER_OF_TASKS_TO_DISPLAY;


    return (
        <div className="flex flex-col gap-4 swim-lane">
            <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                    {title}
                    <Badge className={`${badgeClass} border-0`}>
                        {totalCount !== undefined ? totalCount : tasks.length}
                    </Badge>
                </h3>
            </div>

            {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks</p>
            ) : activeTab === 'all' ? (
                <div className="flex flex-col gap-4">
                    {fewTasks.map((task) => (
                        <TaskCard key={task.id} {...task} setShowModal={setShowModal} setEditTaskId={setEditTaskId} deleteTask={deleteTask} />
                    ))}
                </div>
            ) : (
                <div
                    ref={parentRef}
                    onScroll={handleScroll}
                    className="overflow-auto max-h-[calc(100vh-20rem)]"
                >
                    <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
                        {virtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                data-key={virtualItem.key}
                                ref={virtualizer.measureElement}

                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <div className="mb-4">
                                    <TaskCard
                                        key={tasks[virtualItem.index].id}
                                        {...tasks[virtualItem.index]}
                                        setShowModal={setShowModal}
                                        setEditTaskId={setEditTaskId}
                                        deleteTask={deleteTask}
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                    {isLoadingMore && (
                        <p className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                            Loading more tasks...
                        </p>
                    )}
                </div>
            )}
            {activeTab === 'all' && showViewAllButton && (
                <div className="flex items-center justify-center mt-4">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-gray-700"
                        onClick={handleViewAll}
                    >
                        View All
                    </button>
                </div>
            )}
        </div>
    );
}

export default TaskGroup