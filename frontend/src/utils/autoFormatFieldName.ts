/**
 * Automatically formats a field name into a human-readable label
 *
 * Transforms snake_case or camelCase field names into Title Case labels by:
 * - Splitting on underscores
 * - Capitalizing the first letter of each word
 * - Joining with spaces
 *
 * @param fieldName - The field name to format (e.g., "first_name", "email_address")
 * @returns A formatted, human-readable label (e.g., "First Name", "Email Address")
 *
 * @example
 * ```ts
 * autoFormatFieldName('first_name'); // Returns "First Name"
 * autoFormatFieldName('email_address'); // Returns "Email Address"
 * autoFormatFieldName('user_id'); // Returns "User Id"
 * ```
 */
export const autoFormatFieldName = (fieldName: string): string => {
  return fieldName
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
