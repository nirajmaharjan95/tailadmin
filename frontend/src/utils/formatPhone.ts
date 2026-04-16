export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "-";
  const cleaned = phone.replace(/[^\d]/g, "");
  if (cleaned.length < 10) return phone;
  const trimmed = cleaned.slice(-10);
  return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
}
