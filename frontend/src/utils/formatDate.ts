/**
 * Formats a Date object into a standard date string (YYYY-MM-DD)
 *
 * Converts a Date object to ISO format and extracts only the date portion,
 * removing the time component. This is useful for consistent date display
 * and data export.
 *
 * @param date - The Date object to format
 * @returns A date string in YYYY-MM-DD format (e.g., "2024-01-15")
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15T10:30:00')); // Returns "2024-01-15"
 * formatDate(new Date()); // Returns today's date as "YYYY-MM-DD"
 * ```
 */
export function formatDate(date: Date) {
  return new Date(date).toISOString().split("T")[0];
}

/**
 * Formats a date string into a smart, user-friendly format
 *
 * Provides context-aware date formatting by:
 * - Showing "Today" for the current date
 * - Showing "Tomorrow" for the next day
 * - Showing a formatted date string (e.g., "Jan 15, 2024") for all other dates
 *
 * This improves UX by making dates more relatable and easier to understand
 * at a glance, particularly useful for task lists, deadlines, and schedules.
 *
 * @param dateString - The date string to format (ISO format or any valid date string)
 * @returns A user-friendly date string ("Today", "Tomorrow", or "MMM DD, YYYY")
 *
 * @example
 * ```ts
 * // If today is 2024-01-15
 * formatDateSmart('2024-01-15T10:00:00'); // Returns "Today"
 * formatDateSmart('2024-01-16T10:00:00'); // Returns "Tomorrow"
 * formatDateSmart('2024-01-20T10:00:00'); // Returns "Jan 20, 2024"
 * formatDateSmart('2024-12-25T00:00:00'); // Returns "Dec 25, 2024"
 * ```
 */
export function formatDateSmart(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
