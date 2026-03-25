import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

// GET /api/settings
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PATCH /api/settings (admin only)
router.patch('/', adminOnly, async (req, res) => {
  const { assignment_type } = req.body

  const { data: current } = await supabase.from('settings').select('id').single()

  const { data, error } = await supabase
    .from('settings')
    .update({ assignment_type })
    .eq('id', current.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
