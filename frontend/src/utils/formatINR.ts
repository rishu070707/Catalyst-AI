/**
 * formatINR — formats a number into compact Indian currency notation.
 * Examples:
 *   1200     → ₹1.2K
 *   97000    → ₹97K
 *   254000   → ₹2.54L
 *   1000000  → ₹10L
 */
export function formatINR(value: number): string {
  if (value >= 100000) {
    const lakhs = value / 100000;
    const formatted = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, '');
    return `₹${formatted}L`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1).replace(/\.?0+$/, '');
    return `₹${formatted}K`;
  }
  return `₹${value}`;
}
