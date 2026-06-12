import { STATUS } from "../constants/task.constant";

export const BADGE_COLORS = {
  all: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400',
  todo: 'bg-blue-500/20 text-blue-800 dark:text-blue-200',
  inprogress: 'bg-amber-500/20 text-amber-800 dark:text-amber-200',
  completed: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200',
} as const;

export const TAGCOLORS = {
  'marketing': 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-200',
  'template': 'bg-red-500/20 text-red-800 dark:text-red-200',
  'development': 'bg-green-500/20 text-green-800 dark:text-green-200'
}

export const getStatusColor = (status: string): string => {
  if (status === STATUS.TODO) return BADGE_COLORS.todo;
  if (status === STATUS.IN_PROGRESS) return BADGE_COLORS.inprogress;
  if (status === STATUS.COMPLETED) return BADGE_COLORS.completed;
  return BADGE_COLORS.all;
};

export const getTagColor = (tag: string) => {
  if (tag === 'marketing') return TAGCOLORS.marketing;
  if (tag === 'template') return TAGCOLORS.template;
  if (tag === 'development') return TAGCOLORS.development;
}