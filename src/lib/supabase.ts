import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _serviceSupabase: SupabaseClient | null = null

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!url && url !== 'your_supabase_url_here' && url.startsWith('http')
}

export function getServiceSupabase(): SupabaseClient {
  if (!_serviceSupabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    _serviceSupabase = createClient(url, key)
  }
  return _serviceSupabase
}

export { isConfigured }
