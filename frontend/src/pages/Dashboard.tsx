import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { DashboardStatsComponent } from "@/features/dashboard/components/DashboardStats";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Paperclip,
  Search,
} from "lucide-react";

interface IssueType {
  label: string;
  count: number;
  colorClass: string;
}

interface TodoItem {
  title: string;
  date: string;
  time: string;
  attachments?: number;
  badge?: {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

interface ActivityItem {
  date: string;
  time: string;
  title: string;
  author: string;
  description: string;
}

interface ProjectRow {
  name: string;
  assignees: number;
  start: string;
  deadline: string;
  budget: string;
  progress: number;
  status: "On going" | "Completed" | "Pending";
}

const issueTypes: IssueType[] = [
  { label: "Product design", count: 78, colorClass: "bg-blue-light-500" },
  { label: "Development", count: 63, colorClass: "bg-warning-500" },
  { label: "QA & Testing", count: 56, colorClass: "bg-error-500" },
  { label: "Customer queries", count: 36, colorClass: "bg-success-500" },
  { label: "R & D", count: 24, colorClass: "bg-brand-500" },
];

const todos: TodoItem[] = [
  {
    title: "Designing the dungeon",
    date: "12 Nov, 2021",
    time: "12:00 PM",
    attachments: 2,
    badge: { label: "DRAFT", variant: "outline" },
  },
  {
    title: "Hiring a motion graphic designer",
    date: "12 Nov, 2021",
    time: "12:00 PM",
    attachments: 2,
    badge: { label: "URGENT", variant: "destructive" },
  },
  {
    title: "Daily meetings: purpose, participants",
    date: "12 Dec, 2021",
    time: "05:00 AM",
    attachments: 4,
    badge: { label: "ON PROCESS", variant: "default" },
  },
  {
    title: "Finalizing the geometric shapes",
    date: "12 Nov, 2021",
    time: "12:00 PM",
    attachments: 3,
  },
  {
    title: "Daily standup meetings",
    date: "13 Nov, 2021",
    time: "10:00 PM",
  },
  {
    title: "Make ready for release",
    date: "20 Nov, 2021",
    time: "1:00 AM",
    attachments: 2,
  },
  {
    title: "Delete overlapping tasks and articles",
    date: "25 Nov, 2021",
    time: "1:00 AM",
    attachments: 2,
    badge: { label: "CLOSE", variant: "secondary" },
  },
];

const activities: ActivityItem[] = [
  {
    date: "01 DEC, 2023",
    time: "10:30 AM",
    title: "Phoenix Template: Unleashing Creative Possibilities",
    author: "Shantinon Mekalan",
    description:
      "Discover limitless creativity with the Phoenix template! Our latest update offers an array of innovative features and design options.",
  },
  {
    date: "05 DEC, 2023",
    time: "12:30 AM",
    title: "Empower Your Digital Presence: The Phoenix Template Unveiled",
    author: "Bookworm22",
    description:
      "Unveiling the Phoenix template, a game-changer for your digital presence. With its powerful features and sleek design.",
  },
  {
    date: "15 DEC, 2023",
    time: "2:30 AM",
    title: "Phoenix Template: Simplified Design, Maximum Impact",
    author: "Sharuka Nijibum",
    description:
      "Introducing the Phoenix template, where simplified design meets maximum impact. Elevate your digital presence with its sleek and intuitive features.",
  },
];

const projects: ProjectRow[] = [
  {
    name: "Making the Butterflies shoot each other dead",
    assignees: 6,
    start: "Feb 24, 2020",
    deadline: "Nov 24, 2021",
    budget: "$55k",
    progress: 100,
    status: "Completed",
  },
  {
    name: "Project Zero: Phase 2 rollout",
    assignees: 4,
    start: "Mar 12, 2021",
    deadline: "Aug 16, 2022",
    budget: "$32k",
    progress: 64,
    status: "On going",
  },
  {
    name: "Phoenix CRM Dashboard",
    assignees: 5,
    start: "Jan 05, 2022",
    deadline: "Dec 01, 2022",
    budget: "$74k",
    progress: 12,
    status: "Pending",
  },
];

const statusBadgeVariant: Record<
  ProjectRow["status"],
  "default" | "secondary" | "outline"
> = {
  Completed: "default",
  "On going": "outline",
  Pending: "secondary",
};

const totalIssues = issueTypes.reduce((sum, issue) => sum + issue.count, 0);

const cardClass =
  "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]";

const Dashboard = () => {
  const isAdmin = useIsAdmin();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Projects Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here's what's going on at your business right now
          </p>
        </div>
        <CustomBreadcrumb />
      </div>

      <DashboardStatsComponent isAdmin={isAdmin} />

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={`${cardClass} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Issues Discovered
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Newly found and yet to be solved
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total count{" "}
              <span className="font-bold text-gray-800 dark:text-white/90">
                {totalIssues}
              </span>
            </p>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {issueTypes.map(issue => (
              <li key={issue.label} className="flex items-center gap-2 py-2.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${issue.colorClass}`}
                />
                <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {issue.label}
                </p>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {issue.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cardClass} p-5`}>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={20} className="text-brand-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Project: eleven Progress
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Deadline & progress
              </p>
            </div>
          </div>
          <ul className="space-y-4">
            {projects.map(project => (
              <li key={project.name}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {project.name}
                  </p>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-1.5 rounded-full bg-brand-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                To do
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tasks assigned to me
              </p>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                <Search
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
              </span>
              <input
                type="search"
                placeholder="Search tasks"
                aria-label="Search tasks"
                className="dark:bg-dark-900 h-10 w-full rounded-lg border border-gray-200 bg-transparent py-2 pr-3 pl-9 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 sm:w-56"
              />
            </div>
          </div>
          <ul className="max-h-[420px] divide-y divide-gray-100 overflow-y-auto px-5 dark:divide-gray-800">
            {todos.map((todo, index) => (
              <li key={todo.title} className="flex items-start gap-3 py-3.5">
                <input
                  id={`todo-${index}`}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`todo-${index}`}
                      className="truncate text-sm font-medium text-gray-800 dark:text-white/90"
                    >
                      {todo.title}
                    </label>
                    {todo.badge && (
                      <Badge
                        variant={todo.badge.variant}
                        className="ml-auto shrink-0"
                      >
                        {todo.badge.label}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {todo.attachments !== undefined && (
                      <span className="flex items-center gap-1">
                        <Paperclip size={12} />
                        {todo.attachments}
                      </span>
                    )}
                    <span>{todo.date}</span>
                    <span>{todo.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cardClass} p-5`}>
          <div className="mb-4 flex items-center gap-2">
            <Activity size={20} className="text-brand-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recent activity across all projects
              </p>
            </div>
          </div>
          <ul className="space-y-6">
            {activities.map(item => (
              <li key={item.title} className="flex gap-4">
                <div className="w-20 shrink-0 text-right">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {item.date}
                    <br />
                    {item.time}
                  </p>
                </div>
                <div className="relative flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                    <ClipboardList size={14} className="text-brand-500" />
                  </span>
                  <span className="mt-1 w-px flex-1 border-r border-dashed border-gray-200 dark:border-gray-800" />
                </div>
                <div className="min-w-0 pb-1">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {item.author}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cardClass}>
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Projects
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Brief summary of all projects
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th scope="col" className="px-5 py-3 font-medium">
                  Project name
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Assignees
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Start date
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Deadline
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Budget
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Progress
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {projects.map(project => (
                <tr key={project.name}>
                  <td className="max-w-xs truncate px-5 py-4 font-medium text-gray-800 dark:text-white/90">
                    {project.name}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                    {project.assignees}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {project.start}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {project.deadline}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white/90">
                    {project.budget}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-1.5 rounded-full bg-brand-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusBadgeVariant[project.status]}>
                      {project.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
