import { useState, useEffect } from 'react'
import { getResponseMinutes, formatResponseTime, getResponseClass, getResponseDot } from '../../lib/time'
import { useT } from '../../hooks/useT'

interface Props {
  assignedAt: string
}

export function ResponseTimeCell({ assignedAt }: Props) {
  const t = useT()
  const [minutes, setMinutes] = useState(() => getResponseMinutes(assignedAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getResponseMinutes(assignedAt))
    }, 30000) // update every 30s
    return () => clearInterval(interval)
  }, [assignedAt])

  const cls = getResponseClass(minutes)
  const dot = getResponseDot(minutes)

  return (
    <span className={`flex items-center gap-1.5 font-mono text-sm ${cls}`}>
      <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
      {formatResponseTime(minutes, t('minutes'))}
    </span>
  )
}
