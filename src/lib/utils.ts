import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join Tailwind CSS class names.
 * It combines `clsx` for conditional classes and `tailwind-merge` for resolving conflicts.
 * @param inputs - An array of class values (strings, objects, arrays, etc.)
 * @returns A merged string of Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
