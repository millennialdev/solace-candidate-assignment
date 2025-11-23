/**
 * Formats a phone number to (XXX) XXX-XXXX format
 * @param phoneNumber - The phone number as a string (e.g., "5551234567")
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length !== 10) {
    return phoneNumber;
  }

  const areaCode = phoneNumber.slice(0, 3);
  const middle = phoneNumber.slice(3, 6);
  const last = phoneNumber.slice(6, 10);

  return `(${areaCode}) ${middle}-${last}`;
}

/**
 * Creates a tel: link for phone numbers
 * @param phoneNumber - The phone number as a string
 * @returns tel: URL string
 */
export function getPhoneLink(phoneNumber: string): string {
  return `tel:+1${phoneNumber}`;
}
