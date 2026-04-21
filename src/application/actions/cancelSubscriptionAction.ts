'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { revalidatePath } from 'next/cache'

/**
 * 활성된 정기결제를 취소하는 동작입니다.
 * 보안을 위해 billing_key를 삭제하고 상태를 canceled로 변경합니다.
 * 남은 결제일까지는 계속해서 프로 플랜 권한이 유지됩니다.
 */
export async function cancelSubscriptionAction() {
  const supabase = await createSupabaseServerClient()

  // 1. 현재 사용자 인증 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('로그인이 필요합니다.')
  }

  // 2. 사용자의 현재 활성화된 구독을 찾아 취소
  const { error: cancelError } = await supabase
    .from('subscriptions')
    .update({ 
       // 향후 결제가 반복되지 않게 키 제거
       billing_key: null, 
       // 만료될 때까지 권한 유지용 canceled
       status: 'canceled', 
       updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (cancelError) {
    console.error('Failed to cancel subscription:', cancelError)
    throw new Error('구독 취소 중 에러가 발생했습니다.')
  }

  // 3. UI 최신화 대시보드 리페치
  revalidatePath('/dashboard')
  
  return { success: true }
}
