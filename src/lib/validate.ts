// Shared validation for user-entered text fields (names, addresses, etc).
// A single character is almost never a real name or address, so both the
// contact form and the checkout form reject anything shorter than this.
const MIN_TEXT_LENGTH = 2;

export function isValidText(value: string): boolean {
  return value.trim().length >= MIN_TEXT_LENGTH;
}

export { MIN_TEXT_LENGTH };
