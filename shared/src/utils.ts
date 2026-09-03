export function parsePositiveInt(value: unknown, fallback: number, max?: number): number | undefined {
  if (value === undefined || value === null) {
    return fallback
  }
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return undefined
  }
  return max ? Math.min(parsed, max) : parsed
}
