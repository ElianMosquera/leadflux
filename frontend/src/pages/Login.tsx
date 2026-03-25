import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useT } from '../hooks/useT'
import { useLangStore } from '../store'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const t = useT()
  const { lang, setLang } = useLangStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch {
      setError(t('invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Language toggle top right */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button onClick={() => setLang('en')} className={`text-xs font-mono px-2.5 py-1 rounded border transition-all ${lang === 'en' ? 'border-accent text-accent' : 'border-border text-subtle hover:text-text'}`}>EN</button>
        <button onClick={() => setLang('es')} className={`text-xs font-mono px-2.5 py-1 rounded border transition-all ${lang === 'es' ? 'border-accent text-accent' : 'border-border text-subtle hover:text-text'}`}>ES</button>
      </div>

      <div className="w-full max-w-sm px-6 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_24px_rgba(0,212,255,0.3)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#080B0F">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="font-display font-bold text-bright text-2xl tracking-tight">LeadFlux</span>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="font-display font-semibold text-bright text-xl mb-1">{t('signInTitle')}</h1>
          <p className="text-sm text-subtle font-body mb-7">{t('signInSubtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('email')}</label>
              <input
                type="email"
                className="input"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">{t('password')}</label>
              <input
                type="password"
                className="input"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger bg-opacity-5 border border-danger border-opacity-20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6 font-mono">LeadFlux v1.0</p>
      </div>
    </div>
  )
}
