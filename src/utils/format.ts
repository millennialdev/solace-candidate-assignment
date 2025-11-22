/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * @param phoneNumber - The phone number as a number (e.g., 5551234567)
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: number): string {
  const phoneStr = phoneNumber.toString();

  if (phoneStr.length !== 10) {
    return phoneStr;
  }

  const areaCode = phoneStr.slice(0, 3);
  const middle = phoneStr.slice(3, 6);
  const last = phoneStr.slice(6, 10);

  return `(${areaCode}) ${middle}-${last}`;
}

/**
 * Creates a tel: link for phone numbers
 * @param phoneNumber - The phone number as a number
 * @returns tel: URL string
 */
export function getPhoneLink(phoneNumber: number): string {
  return `tel:+1${phoneNumber}`;
}
