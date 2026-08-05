/**
 * Formats a phone number into a standardized US format (XXX-XXX-XXXX)
 *
 * This function handles various phone number inputs and normalizes them by:
 * 1. Returning "-" for null, undefined, or empty values
 * 2. Removing all non-digit characters (spaces, dashes, parentheses, etc.)
 * 3. Extracting the last 10 digits (handles cases with country codes)
 * 4. Formatting as XXX-XXX-XXXX
 * 5. Returning the original value if fewer than 10 digits
 *
 * This ensures consistent phone number display throughout the application.
 *
 * @param phone - The phone number to format (can be null, undefined, or string)
 * @returns A formatted phone number string (XXX-XXX-XXXX) or "-" if invalid
 *
 * @example
 * ```ts
 * formatPhoneNumber('1234567890'); // Returns "123-456-7890"
 * formatPhoneNumber('(123) 456-7890'); // Returns "123-456-7890"
 * formatPhoneNumber('+1 123 456 7890'); // Returns "123-456-7890"
 * formatPhoneNumber('11234567890'); // Returns "123-456-7890" (strips leading 1)
 * formatPhoneNumber('12345'); // Returns "12345" (less than 10 digits, returned as-is)
 * formatPhoneNumber(null); // Returns "-"
 * formatPhoneNumber(undefined); // Returns "-"
 * formatPhoneNumber(''); // Returns "-"
 * ```
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "-";

  const cleaned = phone.replace(/[^\d]/g, "");

  if (cleaned.length < 10) return phone;

  const trimmed = cleaned.slice(-10);

  // Format as XXX-XXX-XXXX
  return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
}
