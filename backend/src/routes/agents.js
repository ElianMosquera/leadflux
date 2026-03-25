import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// GET /api/agents
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, email, role, status, created_at')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/agents (admin only)
router.post('/', adminOnly, async (req, res) => {
  const { name, email, role = 'agent', password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' })
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (authError) return res.status(400).json({ error: authError.message })

  // Create agent record
  const { data, error } = await supabase
    .from('agents')
    .insert({ name, email, role, status: 'active' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PATCH /api/agents/:id (admin only)
router.patch('/:id', adminOnly, async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from('agents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/agents/:id (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

export default router
