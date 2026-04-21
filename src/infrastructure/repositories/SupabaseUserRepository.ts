import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { UserRepository, UserSubscriptionInfo, UserPlan } from '@/src/application/ports/out/UserRepository'

export class SupabaseUserRepository implements UserRepository {
  async getUserSubscription(userId: string): Promise<UserSubscriptionInfo | null> {
    const supabase = await createSupabaseServerClient()

    // 1. users 테이블에서 plan 정보 조회
    // (subscriptions 테이블과 트리거로 동기화되어 있지만, users 테이블 조회가 더 직관적일 수 있음)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return null
    }

    // 2. subscriptions 테이블에서 상세 상태 조회
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    return {
      userId,
      plan: (userData.plan as UserPlan) || 'free',
      status: subData ? (subData.status as any) : 'active'
    }
  }
}
