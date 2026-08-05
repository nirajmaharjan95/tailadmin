import { toast } from "sonner";

/**
 * Displays a success toast notification with custom styling
 *
 * This utility function provides a consistent way to show success messages
 * throughout the application using the Sonner toast library. The toast
 * appears with a green background and white text.
 *
 * Common use cases:
 * - Confirming successful form submissions
 * - Acknowledging completed actions (save, delete, update)
 * - Notifying users of successful API operations
 *
 * @param message - The success message to display to the user
 *
 * @example
 * ```ts
 * onSuccess('Employee added successfully');
 * onSuccess('Changes saved');
 * onSuccess('Profile updated');
 * ```
 */
export const onSuccess = (message: string) => {
  toast.success(message, {
    className: "!bg-green-600 !text-white !border-none",
  });
};

/**
 * Displays an error toast notification with custom styling
 *
 * This utility function provides a consistent way to show error messages
 * throughout the application using the Sonner toast library. The toast
 * appears with a red background and white text.
 *
 * The function intelligently handles different error types:
 * - If the error is an Error instance, displays the error message
 * - Otherwise, displays the provided fallback message
 *
 * Common use cases:
 * - Showing API error responses
 * - Displaying validation errors
 * - Notifying users of failed operations
 *
 * @param error - The error object (can be Error instance or any other type)
 * @param fallback - The fallback message to display if error is not an Error instance
 *
 * @example
 * ```ts
 * // With Error object
 * try {
 *   await saveData();
 * } catch (error) {
 *   onError(error, 'Failed to save data');
 * }
 *
 * // With custom message only
 * onError(null, 'No data to export');
 *
 * // With different fallback
 * onError(apiError, 'Unable to connect to server');
 * ```
 */
export const onError = (error: unknown, fallback = "Something went wrong") => {
  // Extract error message if it's an Error instance, otherwise use fallback
  const message = error instanceof Error ? error.message : fallback;

  toast.error(message, {
    className: "!bg-red-600 !text-white !border-none",
  });
};
