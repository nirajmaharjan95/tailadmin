import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Ellipsis } from 'lucide-react';
import { useRef, useState } from 'react';

interface IMoreOption {
    children?: string[];
}

const MoreOptions = ({ children }: IMoreOption) => {
    const [showOption, setShowOption] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const toggleShowOption = () => {
        setShowOption((prev) => !prev)
    }

    useOutsideClick({
        ref,
        onClickOutside: () => setShowOption(false),
    });

    return (
        <div ref={ref} className="relative">
            <button className="text-gray-700 dark:text-gray-400" onClick={toggleShowOption}>
                <Ellipsis size={16} />
            </button>

            {showOption && children && (
                <div
                    className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
                >
                    {children.map((item) => {
                        if (item.toLowerCase() === 'edit') {
                            return (
                                <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                    Edit
                                </button>
                            )
                        }
                        if (item.toLocaleLowerCase() === 'delete') {
                            return (
                                <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                    Delete
                                </button>
                            )
                        }

                        if (item.toLocaleLowerCase() === 'clear all') {
                            return (
                                <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                                    Clear All
                                </button>
                            )
                        }
                    })}
                </div>
            )}
        </div>
    )
}

export default MoreOptions