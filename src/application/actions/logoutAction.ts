'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { redirect } from 'next/navigation'

/**
 * 사용자 로그아웃을 처리하고 메인 페이지로 이동시킵니다.
 */
export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Logout failed:', error.message)
    // 에러가 발생해도 일단 리다이렉트 처리 (세션 만료 등의 이유일 수 있음)
  }

  redirect('/')
}
