import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats digits using the Indian numbering system (lakh/crore grouping), e.g. "100000" -> "1,00,000".
export function formatIndianNumber(value: string | number) {
  const digits = String(value).replace(/\D/g, "")
  if (digits.length <= 3) return digits
  const lastThree = digits.slice(-3)
  const rest = digits.slice(0, -3)
  return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
}
