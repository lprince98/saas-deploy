import { createBrowserClient } from '@supabase/ssr'

/**
 * 클라이언트 컴포넌트에서 사용하는 Supabase 브라우저 클라이언트
 * 소셜 OAuth 콜백 처리 등 클라이언트 측 인증 흐름에서만 사용
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
