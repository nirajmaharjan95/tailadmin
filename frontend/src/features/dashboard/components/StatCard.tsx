import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | undefined;
  caption: string;
  icon: LucideIcon;
  iconColor: string;
  isLoading?: boolean;
  error?: Error | null;
}

export const StatCard = ({
  label,
  value,
  caption,
  icon: Icon,
  iconColor,
  isLoading,
  error,
}: StatCardProps) => {
  const cardClass =
    "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]";

  if (isLoading) {
    return (
      <div className={`${cardClass} p-5`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${cardClass} p-5`}>
        <div className="flex items-center gap-3 text-red-500">
          <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Icon size={24} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Failed to load {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClass} p-5`}>
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {value ?? 0}
            </h3>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{caption}</p>
        </div>
      </div>
    </div>
  );
};
