import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useT } from '../hooks/useT'
import type { Agent } from '../lib/types'

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent' })
  const [formError, setFormError] = useState('')
  const t = useT()

  const fetchAgents = useCallback(async () => {
    try {
      const data = await api.get<Agent[]>('/agents')
      setAgents(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return
    setCreating(true)
    setFormError('')
    try {
      const newAgent = await api.post<Agent>('/agents', form)
      setAgents(prev => [...prev, newAgent])
      setShowForm(false)
      setForm({ name: '', email: '', password: '', role: 'agent' })
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : t('error'))
    } finally {
      setCreating(false)
    }
  }

  const toggleStatus = async (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active'
    try {
      await api.patch(`/agents/${agent.id}`, { status: newStatus })
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: newStatus } : a))
    } catch { /* ignore */ }
  }

  const deleteAgent = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    try {
      await api.delete(`/agents/${id}`)
      setAgents(prev => prev.filter(a => a.id !== id))
    } catch { /* ignore */ }
  }

  const thClass = 'text-left px-6 py-4 text-xs font-display font-medium text-subtle uppercase tracking-wider'

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl text-bright">{t('agentsList')}</h1>
          <p className="text-subtle text-sm font-body mt-1">{agents.length} agents registered</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('addAgent')}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 mb-6 animate-slide-up">
          <h2 className="font-display font-semibold text-bright mb-5">{t('addAgent')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('agentName')}</label>
              <input className="input" placeholder={t('agentNamePlaceholder')} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('agentEmail')}</label>
              <input className="input" type="email" placeholder={t('agentEmail')} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('agentPassword')}</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('agentRole')}</label>
              <select className="input" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <option value="agent">{t('roleAgent')}</option>
                <option value="admin">{t('roleAdmin')}</option>
              </select>
            </div>
          </div>
          {formError && <p className="text-danger text-sm mt-3">{formError}</p>}
          <div className="flex gap-3 mt-5">
            <button className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? t('creating') : t('createAgent')}
            </button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setFormError('') }}>
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Agents list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-subtle font-body">{t('loading')}</div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-subtle font-body">{t('noAgents')}</p>
            <p className="text-muted text-sm font-body">{t('noAgentsDesc')}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className={thClass}>{t('agentName')}</th>
                <th className={thClass}>{t('agentEmail')}</th>
                <th className={thClass}>{t('agentRole')}</th>
                <th className={thClass}>{t('status')}</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map(agent => (
                <tr key={agent.id} className="hover:bg-panel transition-colors">
                  <td className="px-6 py-4 text-bright font-medium">{agent.name}</td>
                  <td className="px-6 py-4 text-text font-body">{agent.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      agent.role === 'admin' ? 'bg-accent bg-opacity-10 text-accent' : 'bg-muted text-subtle'
                    }`}>{agent.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      agent.status === 'active'
                        ? 'bg-success bg-opacity-10 text-success'
                        : 'bg-muted text-subtle'
                    }`}>
                      {agent.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(agent)} className="text-xs btn-ghost py-1.5 px-3">
                        {agent.status === 'active' ? t('deactivate') : t('activate')}
                      </button>
                      <button onClick={() => deleteAgent(agent.id)} className="text-xs btn-danger py-1.5 px-3">
                        {t('deleteAgent')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}