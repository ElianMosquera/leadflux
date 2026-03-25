import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { useT } from '../hooks/useT'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ResponseTimeCell } from '../components/ui/ResponseTimeCell'
import type { Lead } from '../lib/types'

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAdmin } = useAuth()
  const t = useT()

  const [showCreate, setShowCreate] = useState(false)

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all')
  const [agentFilter, setAgentFilter] = useState('all')

  // =========================
  // CREATE
  // =========================
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' })
  const [creatingLead, setCreatingLead] = useState(false)
  const [leadFormError, setLeadFormError] = useState('')
  const [leadFormSuccess, setLeadFormSuccess] = useState('')

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setLeadFormError('')
    setLeadFormSuccess('')

    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      setLeadFormError('Name and email are required')
      return
    }

    setCreatingLead(true)
    try {
      const created = await api.post<Lead>('/leads', {
        name: leadForm.name.trim(),
        email: leadForm.email.trim(),
        phone: leadForm.phone.trim() || undefined
      })

      setLeads(prev => [created, ...prev])
      setLeadForm({ name: '', email: '', phone: '' })
      setLeadFormSuccess('Lead created')

      setTimeout(() => setLeadFormSuccess(''), 2000)
      setShowCreate(false)
    } catch (err: unknown) {
      setLeadFormError(err instanceof Error ? err.message : t('error'))
    } finally {
      setCreatingLead(false)
    }
  }

  // =========================
  // DELETE
  // =========================
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return
    try {
      await api.delete(`/leads/${id}`)
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch {
      alert('Error deleting')
    }
  }

  // =========================
  // EXPORT CSV (FILTRADO)
  // =========================
  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams()

      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (isAdmin && agentFilter !== 'all') params.append('agent', agentFilter)

      const res = await fetch(`/api/leads/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'leads.csv'
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Error exporting CSV')
    }
  }

  // =========================
  // FETCH
  // =========================
  const fetchLeads = useCallback(async () => {
    try {
      const data = await api.get<Lead[]>('/leads')
      setLeads(data)
      setError('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleStatusChange = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    try {
      await api.patch(`/leads/${id}/status`, { status })
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    } catch {}
  }

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        (l.phone ?? '').toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || l.status === statusFilter

      const matchesAgent =
        !isAdmin ||
        agentFilter === 'all' ||
        l.agent?.id === agentFilter

      return matchesSearch && matchesStatus && matchesAgent
    })
  }, [leads, search, statusFilter, agentFilter, isAdmin])

  const agents = useMemo(() => {
    const map = new Map()
    leads.forEach(l => {
      if (l.agent) map.set(l.agent.id, l.agent.name)
    })
    return Array.from(map.entries())
  }, [leads])

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isAdmin ? t('allLeads') : t('myLeads')}
        </h1>

        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="btn-ghost">
            Export CSV
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowCreate(prev => !prev)}
              className="btn-primary"
            >
              + Add Lead
            </button>
          )}

          <button onClick={fetchLeads} className="btn-ghost">
            Refresh
          </button>
        </div>
      </div>

      {/* CREATE */}
      {isAdmin && showCreate && (
        <div className="card p-6 animate-fade-in">
          <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="input" placeholder="Name" value={leadForm.name}
              onChange={(e) => setLeadForm(p => ({ ...p, name: e.target.value }))} />

            <input className="input" placeholder="Email" value={leadForm.email}
              onChange={(e) => setLeadForm(p => ({ ...p, email: e.target.value }))} />

            <input className="input" placeholder="Phone" value={leadForm.phone}
              onChange={(e) => setLeadForm(p => ({ ...p, phone: e.target.value }))} />

            <button className="btn-primary">
              {creatingLead ? 'Creating...' : 'Create'}
            </button>
          </form>

          {leadFormError && <p className="text-danger text-sm mt-3">{leadFormError}</p>}
          {leadFormSuccess && <p className="text-success text-sm mt-3">{leadFormSuccess}</p>}
        </div>
      )}

      {/* FILTER BAR */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex-1 w-full">
          <input
            className="input w-full"
            placeholder="🔍 Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="input min-w-[150px]"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}>
          <option value="all">All status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>

        {isAdmin && (
          <select className="input min-w-[180px]"
            value={agentFilter}
            onChange={e => setAgentFilter(e.target.value)}>
            <option value="all">All agents</option>
            {agents.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* TABLE */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                {isAdmin && <th className="px-6 py-4 text-left">Agent</th>}
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Response</th>
                <th className="px-6 py-4 text-left">Phone</th>
                {isAdmin && <th className="px-6 py-4 text-left">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-panel transition">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>

                  {isAdmin && (
                    <td className="px-6 py-4">{lead.agent?.name ?? '—'}</td>
                  )}

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={lead.status}
                      onChange={(s) => handleStatusChange(lead.id, s)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <ResponseTimeCell assignedAt={lead.assigned_at} />
                  </td>

                  <td className="px-6 py-4">{lead.phone || '—'}</td>

                  {isAdmin && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-danger text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}