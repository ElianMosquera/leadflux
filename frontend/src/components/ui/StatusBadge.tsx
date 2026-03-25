import { useT } from '../../hooks/useT'

type Status = 'new' | 'contacted' | 'closed'

interface Props {
  status: Status
  onChange?: (s: Status) => void
  readonly?: boolean
}

export function StatusBadge({ status, onChange, readonly }: Props) {
  const t = useT()

  const label = { new: t('new'), contacted: t('contacted'), closed: t('closed') }[status]
  const cls = { new: 'badge-new', contacted: 'badge-contacted', closed: 'badge-closed' }[status]

  if (readonly || !onChange) {
    return <span className={cls}><Dot status={status} />{label}</span>
  }

  const next: Record<Status, Status> = { new: 'contacted', contacted: 'closed', closed: 'new' }

  return (
    <button
      onClick={() => onChange(next[status])}
      title={t('updateStatus')}
      className={`${cls} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <Dot status={status} />
      {label}
    </button>
  )
}

function Dot({ status }: { status: Status }) {
  const color = { new: 'bg-accent', contacted: 'bg-warning', closed: 'bg-success' }[status]
  return <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse-dot`} />
}
