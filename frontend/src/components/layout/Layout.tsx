import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useT } from '../../hooks/useT'
import { useLangStore } from '../../store'

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const IconAgents = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconAdmin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const IconSignOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

interface Props { children: React.ReactNode }

export function Layout({ children }: Props) {
  const { agent, signOut, isAdmin } = useAuth()
  const t = useT()
  const navigate = useNavigate()
  const { lang, setLang } = useLangStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
      isActive
        ? 'bg-accent bg-opacity-10 text-accent border border-accent border-opacity-20'
        : 'text-subtle hover:text-text hover:bg-muted hover:bg-opacity-30'
    }`

  return (
    <div className="flex h-screen bg-void overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#080B0F">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-display font-700 text-bright tracking-tight text-lg">LeadFlux</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" className={navClass}>
            <IconDashboard />
            {t('dashboard')}
          </NavLink>

          {isAdmin && (
            <NavLink to="/agents" className={navClass}>
              <IconAgents />
              {t('agents')}
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              <IconAdmin />
              {t('adminPanel')}
            </NavLink>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-3">
          {/* Language toggle */}
          <div className="flex items-center gap-2 px-4">
            <span className="text-xs text-subtle font-body">{t('language')}:</span>
            <button
              onClick={() => setLang('en')}
              className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${lang === 'en' ? 'text-accent' : 'text-subtle hover:text-text'}`}
            >EN</button>
            <span className="text-subtle text-xs">/</span>
            <button
              onClick={() => setLang('es')}
              className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${lang === 'es' ? 'text-accent' : 'text-subtle hover:text-text'}`}
            >ES</button>
          </div>

          {/* Agent info */}
          <div className="px-4 py-2.5 rounded-lg bg-panel border border-border">
            <p className="text-xs text-subtle font-body truncate">{agent?.email}</p>
            <p className="text-xs text-text font-display font-medium mt-0.5 truncate">{agent?.name}</p>
            <span className={`inline-block mt-1.5 text-xs font-mono px-1.5 py-0.5 rounded ${
              agent?.role === 'admin'
                ? 'bg-accent bg-opacity-10 text-accent'
                : 'bg-muted text-subtle'
            }`}>
              {agent?.role}
            </span>
          </div>

          <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-subtle hover:text-danger transition-colors rounded-lg hover:bg-danger hover:bg-opacity-5">
            <IconSignOut />
            {t('signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
