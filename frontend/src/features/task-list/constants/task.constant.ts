
export const STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const TAGS = {
  MARKETING: 'Marketing',
  TEMPLATE: 'Template',
  DEVELOPMENT: 'Development'
} as const

export const FILTERS = [
  { label: 'All Tasks', key: 'all' },
  ...Object.values(STATUS).map((status) => ({ label: status, key: status }))
] as const;


