'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { redirect } from 'next/navigation'

/**
 * 현재 로그인된 사용자를 'pro' 플랜으로 승격시킵니다 (테스트용)
 */
export async function promoteUserToProAction() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // 1. subscriptions 업데이트
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: user.id,
      plan: 'pro',
      status: 'active',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

  if (subError) {
    console.error('Promotion failed (sub):', subError)
    // Fallback to user update if sub fails
  }

  // 2. user plan 업데이트
  const { error: userError } = await supabase
    .from('users')
    .update({ plan: 'pro' })
    .eq('id', user.id)

  if (userError) {
    console.error('Promotion failed (user):', userError)
    throw new Error('프로 승격에 실패했습니다.')
  }

  redirect('/dashboard')
}
