import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useT } from '../hooks/useT'
import { formatResponseTime } from '../lib/time'
import type { AdminStats, Settings } from '../lib/types'

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [assignType, setAssignType] = useState('round_robin')

  // 🔥 NEW
  const [resettingUserId, setResettingUserId] = useState<string | null>(null)

  const t = useT()

  const fetchAll = useCallback(async () => {
    try {
      const [s, cfg] = await Promise.all([
        api.get<AdminStats>('/admin/stats'),
        api.get<Settings>('/settings')
      ])
      setStats(s)
      setSettings(cfg)
      setAssignType(cfg.assignment_type)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const saveSettings = async () => {
    setSaving(true)
    try {
      await api.patch('/settings', { assignment_type: assignType })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  // 🔥 RESET PASSWORD
  const handleResetPassword = async (userId: string) => {
    if (!confirm('Reset password for this user?')) return

    try {
      setResettingUserId(userId)

      await api.post('/admin/reset-password', { userId })

      alert('Password reset email sent')
    } catch (err) {
      console.error(err)
      alert('Error resetting password')
    } finally {
      setResettingUserId(null)
    }
  }

  if (loading) {
    return <div className="p-8 text-subtle font-body animate-fade-in">{t('loading')}</div>
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="p-8 animate-fade-in space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-2xl text-bright">{t('adminPanel')}</h1>
        <p className="text-subtle text-sm font-body mt-1">
          Performance overview & configuration
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="label">{t('totalLeads')}</p>
          <p className="font-display font-bold text-4xl text-bright mt-2">
            {stats?.totalLeads ?? 0}
          </p>
        </div>

        <div className="card p-6">
          <p className="label">{t('avgResponseTime')}</p>
          <p className="font-display font-bold text-4xl text-bright mt-2">
            {formatResponseTime(stats?.avgResponseTime ?? 0, t('minutes'))}
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-bright">
            {t('leaderboard')}
          </h2>
        </div>

        {!stats?.leaderboard.length ? (
          <div className="py-16 text-center text-subtle font-body text-sm">
            No data yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">

              {/* HEADER */}
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-subtle">
                  <th className="px-6 py-3 w-[80px] text-left">{t('rank')}</th>
                  <th className="px-6 py-3 text-left">{t('agent')}</th>
                  <th className="px-6 py-3 w-[120px] text-left">{t('totalAssigned')}</th>
                  <th className="px-6 py-3 w-[120px] text-left">{t('contacted2')}</th>
                  <th className="px-6 py-3 w-[120px] text-left">{t('closedLeads')}</th>
                  <th className="px-6 py-3 w-[160px] text-left">{t('avgResponseTime')}</th>

                  {/* 🔥 NEW COLUMN */}
                  <th className="px-6 py-3 w-[160px] text-left">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-border">
                {stats.leaderboard.map((entry, i) => (
                  <tr key={entry.agent.id} className="hover:bg-panel transition-colors">

                    {/* Rank */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-lg">
                        {medals[i] ?? `#${i + 1}`}
                      </span>
                    </td>

                    {/* Agent */}
                    <td className="px-6 py-4">
                      <p className="text-bright font-medium">{entry.agent.name}</p>
                      <p className="text-muted text-xs">{entry.agent.email}</p>
                    </td>

                    {/* Assigned */}
                    <td className="px-6 py-4 font-mono">
                      {entry.totalLeads}
                    </td>

                    {/* Contacted */}
                    <td className="px-6 py-4 font-mono text-warning">
                      {entry.contactedLeads}
                    </td>

                    {/* Closed */}
                    <td className="px-6 py-4 font-mono text-success">
                      {entry.closedLeads}
                    </td>

                    {/* Response Time */}
                    <td className="px-6 py-4">
                      <span className={`font-mono ${
                        entry.avgResponseTime < 2 ? 'text-success' :
                        entry.avgResponseTime <= 5 ? 'text-warning' : 'text-danger'
                      }`}>
                        {formatResponseTime(entry.avgResponseTime, t('minutes'))}
                      </span>
                    </td>

                    {/* 🔥 RESET PASSWORD BUTTON */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleResetPassword(entry.agent.id)}
                        disabled={resettingUserId === entry.agent.id}
                        className="text-xs text-accent hover:underline"
                      >
                        {resettingUserId === entry.agent.id
                          ? 'Sending...'
                          : 'Reset Password'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-bright mb-5">
          {t('settings')}
        </h2>

        <div className="max-w-xs">
          <label className="label">{t('assignmentType')}</label>
          <select
            className="input"
            value={assignType}
            onChange={e => setAssignType(e.target.value)}
          >
            <option value="round_robin">{t('roundRobin')}</option>
          </select>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving || saved}
          className="btn-primary mt-4"
        >
          {saved ? t('saved') : saving ? t('saving') : t('saveSettings')}
        </button>
      </div>

      {/* Debug */}
      {settings && (
        <div className="card p-4 bg-opacity-50">
          <p className="text-xs font-mono text-muted">
            Assignment type: <span className="text-accent">{settings.assignment_type}</span>
            {' · '}
            Last index: <span className="text-accent">{settings.last_assigned_index}</span>
          </p>
        </div>
      )}
    </div>
  )
}