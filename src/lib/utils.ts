import { type ClassValue, clsx } from "clsx"

/**
 * Utility function for merging Tailwind CSS classes
 * Uses clsx for conditional classes and proper string concatenation
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}