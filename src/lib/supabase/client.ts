import { createBrowserClient } from '@supabase/ssr'

// Variable para almacenar la única instancia en el navegador
let cachedClient: ReturnType<typeof createBrowserClient> | null = null

export function createBrowserSupabaseClient() {
  if (cachedClient) {
    return cachedClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  cachedClient = createBrowserClient(url, key)
  return cachedClient
}