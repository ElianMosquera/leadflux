import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const agent = useAuthStore(s => s.agent)

  if (!agent) return <Navigate to="/login" replace />
  if (adminOnly && agent.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
