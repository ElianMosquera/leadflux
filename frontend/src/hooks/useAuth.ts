import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import type { Agent } from '../lib/types'

async function fetchAgentForSession(email: string, token: string): Promise<Agent | null> {
  try {
    const res = await fetch('/api/agents', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) return null
    const agents: Agent[] = await res.json()
    return agents.find(a => a.email === email) ?? null
  } catch {
    return null
  }
}

export function useAuth() {
  const { agent, setAgent } = useAuthStore()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setAgent(null)
        return
      }
      // Covers INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED
      const me = await fetchAgentForSession(session.user.email!, session.access_token)
      setAgent(me)
    })

    return () => subscription.unsubscribe()
  }, [setAgent])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAgent(null)
  }

  return { agent, signIn, signOut, isAdmin: agent?.role === 'admin' }
}