import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware, adminOnly)

// =========================
// GET /api/admin/stats
// =========================
router.get('/stats', async (req, res) => {
  // Total leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // Leads per agent with response time
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      assigned_to,
      status,
      assigned_at,
      created_at,
      agent:agents!assigned_to(id, name, email)
    `)

  if (error) return res.status(500).json({ error: error.message })

  const now = Date.now()
  const agentStats = {}

  for (const lead of leads) {
    const agentId = lead.assigned_to
    if (!agentStats[agentId]) {
      agentStats[agentId] = {
        agent: lead.agent,
        totalLeads: 0,
        contactedLeads: 0,
        closedLeads: 0,
        responseTimes: []
      }
    }

    agentStats[agentId].totalLeads++

    if (lead.status === 'contacted') agentStats[agentId].contactedLeads++
    if (lead.status === 'closed') agentStats[agentId].closedLeads++

    if (lead.assigned_at) {
      const responseMinutes = (now - new Date(lead.assigned_at).getTime()) / 60000
      agentStats[agentId].responseTimes.push(responseMinutes)
    }
  }

  const leaderboard = Object.values(agentStats).map(stat => ({
    agent: stat.agent,
    totalLeads: stat.totalLeads,
    contactedLeads: stat.contactedLeads,
    closedLeads: stat.closedLeads,
    avgResponseTime: stat.responseTimes.length
      ? stat.responseTimes.reduce((a, b) => a + b, 0) / stat.responseTimes.length
      : 0
  })).sort((a, b) => a.avgResponseTime - b.avgResponseTime)

  const allResponseTimes = leads
    .filter(l => l.assigned_at)
    .map(l => (now - new Date(l.assigned_at).getTime()) / 60000)

  const avgResponseTime = allResponseTimes.length
    ? allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length
    : 0

  res.json({
    totalLeads,
    avgResponseTime,
    leaderboard
  })
})


// =========================
// 🔐 RESET PASSWORD (ADMIN)
// =========================
router.post('/users/:id/reset-password', async (req, res) => {
  const { id } = req.params

  // 1. Obtener email del agente
  const { data: user, error: userError } = await supabase
    .from('agents')
    .select('email')
    .eq('id', id)
    .single()

  if (userError || !user) {
    return res.status(404).json({ error: 'User not found' })
  }

  // 2. Generar link de recuperación (Supabase Auth)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: user.email
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // (Opcional pero útil) devolver el link generado
  res.json({
    success: true,
    // ⚠️ útil para debug o flujo custom frontend
    recovery_link: data?.properties?.action_link || null
  })
})

export default router