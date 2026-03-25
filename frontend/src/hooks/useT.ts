import { translations, type TKey } from '../lib/i18n'
import { useLangStore } from '../store'

export function useT() {
  const lang = useLangStore((s) => s.lang)
  return (key: TKey): string => translations[lang][key] ?? translations.en[key]
}
