import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// =========================
// ROUND ROBIN
// =========================
async function assignLead() {
  const { data: agents, error: agentsError } = await supabase
    .from('agents')
    .select('id')
    .eq('status', 'active')
    .eq('role', 'agent')
    .order('created_at', { ascending: true })

  if (agentsError || !agents.length) {
    throw new Error('No active agents available')
  }

  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (settingsError) throw new Error('Could not fetch settings')

  const nextIndex = (settings.last_assigned_index + 1) % agents.length
  const assignedAgent = agents[nextIndex]

  await supabase
    .from('settings')
    .update({ last_assigned_index: nextIndex })
    .eq('id', settings.id)

  return assignedAgent.id
}

// =========================
// CREATE LEAD
// =========================
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }

  let assignedTo
  try {
    assignedTo = await assignLead()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  const now = new Date().toISOString()

  // 1. Create the lead
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name,
      email,
      phone,
      assigned_to: assignedTo,
      status: 'new',
      assigned_at: now,
      created_at: now
    })
    .select(`
      *,
      agent:agents!assigned_to(id, name, email)
    `)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // 2. Create notification for the UI Badge (NEW STEP)
  // We do this after lead creation to ensure we have a valid lead
  const { error: notifError } = await supabase
    .from('notifications')
    .insert({
      user_id: assignedTo,
      title: 'New Lead Assigned',
      message: `You have been assigned a new lead: ${name}`,
      type: 'lead_assigned',
      metadata: { lead_id: data.id, name: data.name }
    })

  if (notifError) {
    console.error('Notification failed to insert:', notifError.message)
    // We don't block the response here because the lead was already successfully created
  }

  res.status(201).json(data)
})

// =========================
// GET LEADS
// =========================
router.get('/', async (req, res) => {
  let query = supabase
    .from('leads')
    .select(`
      *,
      agent:agents!assigned_to(id, name, email)
    `)
    .order('created_at', { ascending: false })

  if (req.user.role === 'agent') {
    query = query.eq('assigned_to', req.user.id)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

// =========================
// EXPORT CSV 🔥
// =========================
router.get('/export', async (req, res) => {
  const { status } = req.query

  let query = supabase
    .from('leads')
    .select(`
      name,
      email,
      phone,
      status,
      assigned_at,
      created_at,
      agent:agents!assigned_to(name, email)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (req.user.role === 'agent') {
    query = query.eq('assigned_to', req.user.id)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })

  const headers = [
    'Name',
    'Email',
    'Phone',
    'Status',
    'Agent Name',
    'Agent Email',
    'Assigned At',
    'Created At'
  ]

  const rows = data.map(l => [
    l.name,
    l.email,
    l.phone || '',
    l.status,
    l.agent?.name || '',
    l.agent?.email || '',
    l.assigned_at,
    l.created_at
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r =>
      r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')

  res.send(csv)
})

// =========================
// UPDATE STATUS
// =========================
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const validStatuses = ['new', 'contacted', 'closed']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  let query = supabase
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (req.user.role === 'agent') {
    query = query.eq('assigned_to', req.user.id)
  }

  const { data, error } = await query.select().single()
  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

// =========================
// DELETE LEAD
// =========================
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed' })
  }

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ success: true })
})

export default router