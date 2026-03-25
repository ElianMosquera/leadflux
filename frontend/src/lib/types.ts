export interface Agent {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent'
  status: 'active' | 'inactive'
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  assigned_to: string
  agent?: Pick<Agent, 'id' | 'name' | 'email'>
  status: 'new' | 'contacted' | 'closed'
  created_at: string
  assigned_at: string
}

export interface AdminStats {
  totalLeads: number
  avgResponseTime: number
  leaderboard: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  agent: Pick<Agent, 'id' | 'name' | 'email'>
  totalLeads: number
  contactedLeads: number
  closedLeads: number
  avgResponseTime: number
}

export interface Settings {
  id: string
  assignment_type: string
  last_assigned_index: number
}
