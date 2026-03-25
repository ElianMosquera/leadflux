import { supabase } from '../lib/supabase.js'

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.split(' ')[1]

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // Fetch agent row to get role
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('id, name, email, role, status')
    .eq('email', user.email)
    .single()

  if (agentError || !agent) {
    return res.status(403).json({ error: 'User not registered as agent' })
  }

  req.user = { ...user, ...agent }
  next()
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
