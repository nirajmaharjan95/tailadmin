import { BookOpen, GraduationCap, ReceiptText, Users } from "lucide-react";
import { useStats } from "../hooks/useStats";
import { StatCard } from "./StatCard";
import { DashboardStats } from "../types/dashboard.types";

interface DashboardStatsProps {
  isAdmin: boolean;
}

export const DashboardStatsComponent = ({ isAdmin }: DashboardStatsProps) => {
  const { stats, isLoading, error, refetch } = useStats();

  // Dynamic stat configuration based on role and available data
  const statConfigs = [
    {
      label: "Employees",
      key: "employees" as keyof DashboardStats,
      caption: "dedicated employees",
      icon: Users,
      iconColor: "bg-success-500",
    },
    {
      label: "Products",
      key: "products" as keyof DashboardStats,
      caption: "innovative products",
      icon: ReceiptText,
      iconColor: "bg-warning-500",
    },
    {
      label: "Tasks",
      key: "tasks" as keyof DashboardStats,
      caption: "meaningful tasks",
      icon: BookOpen,
      iconColor: "bg-brand-500",
    },
    {
      label: isAdmin ? "Users" : "Courses",
      key: (isAdmin ? "users" : "courses") as keyof DashboardStats,
      caption: isAdmin ? "trusted users" : "expert-led courses",
      icon: isAdmin ? Users : GraduationCap,
      iconColor: isAdmin ? "bg-error-500" : "bg-blue-500",
    },
  ];

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="text-red-500">Failed to load dashboard stats</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfigs.map(config => {
        const statData = stats?.[config.key];
        const value = statData?.total;

        return (
          <StatCard
            key={config.label}
            label={config.label}
            value={value}
            caption={config.caption}
            icon={config.icon}
            iconColor={config.iconColor}
            isLoading={isLoading}
            error={isLoading ? undefined : error}
          />
        );
      })}
    </div>
  );
};
