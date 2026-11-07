/**
 * Currency utilities for Nigerian Naira (₦)
 */

export function formatNaira(amount: number | string): string {
  if (amount === undefined || amount === null || amount === "") return "₦0";
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/,/g, ""))
      : amount;
  if (isNaN(num)) return "₦0";

  // Standard Naira format without decimal cents unless needed
  return `₦${Math.round(num).toLocaleString("en-US")}`;
}

export function formatNumberWithCommas(value: string | number): string {
  if (!value && value !== 0) return "";
  const str = String(value).replace(/[^0-9.]/g, "");
  const parts = str.split(".");
  // Only allow one decimal point
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${integerPart}.${parts[1].slice(0, 2)}`;
  }
  return integerPart;
}

export function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  const clean = String(value).replace(/,/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

