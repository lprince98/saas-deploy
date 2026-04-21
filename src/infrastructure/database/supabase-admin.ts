import { createClient } from '@supabase/supabase-js'

/**
 * RLS를 우회하여 관리자 권한으로 DB 작업을 수행할 때 사용하는
 * Supabase 어드민 클라이언트 — Service Role Key 사용
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error('Supabase environment variables are missing (Admin)')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
