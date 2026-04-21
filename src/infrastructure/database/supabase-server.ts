import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server Component / Server Action / Route Handler에서 사용하는
 * Supabase 서버 클라이언트 — 쿠키 기반 세션 관리
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Component에서는 쿠키 쓰기 불가 — middleware에서 처리됩니다
          }
        },
      },
    },
  )
}
