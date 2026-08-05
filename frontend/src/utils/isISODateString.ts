/**
 * Checks if a value is an ISO date string
 * @param value - The value to check
 * @returns true if the value is an ISO date string, false otherwise
 */
export const isISODateString = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  return isoDateRegex.test(value);
};
