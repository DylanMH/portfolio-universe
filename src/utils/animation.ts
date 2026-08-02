export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function smoothStep(min: number, max: number, value: number): number {
  const x = clamp((value - min) / (max - min), 0, 1)
  return x * x * (3 - 2 * x)
}
