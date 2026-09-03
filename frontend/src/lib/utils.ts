import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVisiblePageRange(
  activePage: number,
  totalPages: number,
  vp: number
): { start: number; end: number } {
  // If total pages fit within the visible window, show all of them
  if (totalPages <= vp) {
    return { start: 1, end: totalPages }
  }

  const half = Math.floor(vp / 2)

  let start = activePage - half
  let end = activePage + (vp - half - 1) // handles both even/odd vp correctly

  // Clamp to the left edge
  if (start < 1) {
    start = 1
    end = vp
  }

  // Clamp to the right edge
  if (end > totalPages) {
    end = totalPages
    start = totalPages - vp + 1
  }

  return { start, end }
}
