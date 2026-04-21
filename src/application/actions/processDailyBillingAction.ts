'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { TossPaymentsService } from '@/src/infrastructure/services/TossPaymentsService'

export async function processDailyBillingAction() {
  const supabase = await createSupabaseServerClient()

  const now = new Date().toISOString()
  let successCount = 0
  let failCount = 0
  
  // 0. 취소되었지만 기간이 만료된 구독들 찾아 완전히 권한 회수 (status = 'expired')
  const { data: canceledSubs, error: canceledError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('status', 'canceled')
    .lte('current_period_end', now)

  if (canceledError) {
    console.error('Failed to fetch canceled subscriptions:', canceledError)
  } else if (canceledSubs && canceledSubs.length > 0) {
    const ids = canceledSubs.map(sub => sub.id);
    const { error: markExpiredError } = await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: now })
      .in('id', ids);
    
    if (markExpiredError) {
      console.error('Failed to mark canceled subscriptions as expired:', markExpiredError);
    } else {
      console.log(`Successfully expired ${canceledSubs.length} canceled subscriptions.`);
    }
  }

  // 1. 만료일이 지난(결제일이 도래한) 활성 구독 최대 100건 조회
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .not('billing_key', 'is', null)
    .lte('current_period_end', now)
    .limit(100)

  if (error) {
    console.error('Failed to fetch due subscriptions:', error)
    throw new Error('구독 정보를 불러오는 데 실패했습니다.')
  }

  // 결제 대상이 없으면 조기 종료
  if (!subscriptions || subscriptions.length === 0) {
    return { successCount, failCount }
  }

  // 2. 각 건에 대해 Toss Payments API 빌링 승인 호출
  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const orderId = `recurring_${sub.id}_${Date.now()}`
      const amount = sub.amount_krw || 0

      try {
        // Toss 정기결제 실행 API 호출
        const paymentData = await TossPaymentsService.executeBilling(sub.billing_key, {
          customerKey: sub.customer_key,
          amount: amount,
          orderId: orderId,
          orderName: `${sub.plan.toUpperCase()} Curator Plan (정기결제)`,
        });

        const paymentKey = paymentData.paymentKey

        // 성공 로직: 현재 시간부터 +30일 주기 연장
        const currentDate = new Date()
        const nextBillingDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)

        await supabase
          .from('subscriptions')
          .update({
            current_period_start: currentDate.toISOString(),
            current_period_end: nextBillingDate.toISOString(),
            updated_at: currentDate.toISOString()
          })
          .eq('id', sub.id)

        await supabase
          .from('payment_logs')
          .insert({
             order_id: orderId,
             user_id: sub.user_id,
             amount: amount,
             plan_name: sub.plan,
             payment_key: paymentKey,
             status: 'SUCCESS'
          })

        successCount++
        return Promise.resolve(paymentData)
        
      } catch (errorData: any) {
        // 결제 실패 시 처리
        await supabase
          .from('subscriptions')
          .update({ status: 'expired', updated_at: new Date().toISOString() })
          .eq('id', sub.id)

        // 실패 로그 작성
        await supabase
          .from('payment_logs')
          .insert({
             order_id: orderId,
             user_id: sub.user_id,
             amount: amount,
             plan_name: sub.plan,
             status: 'FAILED',
             error_details: errorData.message || 'Payment execution failed'
          })

        failCount++
        return Promise.reject(errorData)
      }
    })
  )

  return { successCount, failCount }
}
