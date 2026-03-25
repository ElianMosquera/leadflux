import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent } from '../lib/types'
import type { Lang } from '../lib/i18n'

interface AuthState {
  agent: Agent | null
  setAgent: (agent: Agent | null) => void
}

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  agent: null,
  setAgent: (agent) => set({ agent })
}))

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang })
    }),
    { name: 'leadflux-lang' }
  )
)
