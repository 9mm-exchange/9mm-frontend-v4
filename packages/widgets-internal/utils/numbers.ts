export const MAX_DECIMALS_DISPLAY = 16;

/**
 * Truncates a decimal string to a specified number of decimal places
 * @param value - The string value containing a decimal number
 * @param maxDecimals - The maximum number of decimal places to keep
 * @returns The truncated decimal string
 */
export function truncateDecimals(value?: string): string {
  if (!value) {
    return "";
  }

  if (!value.includes(".")) {
    return value;
  }

  const [wholeNumber, decimal] = value.split(".");
  if (!decimal || decimal.length <= MAX_DECIMALS_DISPLAY) {
    return value;
  }

  return `${wholeNumber}.${decimal.slice(0, MAX_DECIMALS_DISPLAY)}`;
}
