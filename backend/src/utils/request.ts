export function parsePositiveInt(value: unknown, fallback: number, max?: number): number | undefined {
  if (value === undefined) {
    return fallback
  }
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return undefined
  }
  return max ? Math.min(parsed, max) : parsed
}

export function parseStringParam(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }
  return undefined
}
