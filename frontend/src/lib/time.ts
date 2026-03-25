export function getResponseMinutes(assignedAt: string): number {
  return (Date.now() - new Date(assignedAt).getTime()) / 60000
}

export function formatResponseTime(minutes: number, unit: string): string {
  if (minutes < 1) return `< 1 ${unit}`
  return `${Math.floor(minutes)} ${unit}`
}

export function getResponseClass(minutes: number): 'rt-green' | 'rt-yellow' | 'rt-red' {
  if (minutes < 2) return 'rt-green'
  if (minutes <= 5) return 'rt-yellow'
  return 'rt-red'
}

export function getResponseDot(minutes: number): string {
  if (minutes < 2) return 'bg-success'
  if (minutes <= 5) return 'bg-warning'
  return 'bg-danger'
}
