'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabasePaymentLogRepository } from '@/src/infrastructure/repositories/SupabasePaymentLogRepository'


const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_XjExPeJWYVQR12P55agr49R5gvNL";

/**
 * 결제 인증 완료 후 빌링키(Billing Key)를 발급받고 
 * 즉시 1회차 정기결제를 실행한 뒤 사용자의 구독 상태를 업데이트하는 Server Action
 */
export async function completePurchaseAction(authKey: string, customerKey: string, orderId: string, amount: number, planName: string) {
  const supabase = await createSupabaseServerClient()

  // 1. 현재 사용자 조회
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('인증된 사용자가 아닙니다.')
  }

  const userId = user.id
  
  // 1-1. DB에서 결제 로그 조회 및 검증 (보안 강화: 클라이언트 amount 변조 방지)
  const logRepository = new SupabasePaymentLogRepository()
  const paymentLog = await logRepository.findByOrderId(orderId)
  
  if (!paymentLog) {
    throw new Error('유효하지 않은 주문 ID입니다.')
  }
  
  if (paymentLog.userId !== userId) {
    throw new Error('결제 정보의 소유자가 일치하지 않습니다.')
  }

  // 실 결제 금액은 클라이언트 파라미터가 아닌 DB에 저장된 값을 사용함
  const verifiedAmount = paymentLog.amountKrw


  // 2. 토스페이먼츠 빌링키 발급 API 호출
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  const issueRes = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authKey,
      customerKey
    }),
  });

  if (!issueRes.ok) {
    const errorData = await issueRes.json()
    console.error('Toss Payments Issue Billing Key Error:', errorData)
    throw new Error(`빌링키 발급 실패: ${errorData.message || '알 수 없는 오류'}`)
  }

  const issueData = await issueRes.json()
  const billingKey = issueData.billingKey

  // 3. 빌링키로 즉시 1회 최초 결제 승인 API 호출 (첫 구독 시작)
  const executeRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerKey,
      amount: verifiedAmount,
      orderId,
      orderName: `${paymentLog.planName || 'Pro'} Curator Plan (정기결제)`,
      customerEmail: user.email, 
      taxFreeAmount: 0 // 면세 금액
    }),
  });

  if (!executeRes.ok) {
    const errorData = await executeRes.json()
    console.error('Toss Payments Execute Billing Error:', errorData)
    throw new Error(`자동 결제 승인 실패: ${errorData.message || '알 수 없는 오류'}`)
  }

  const paymentData = await executeRes.json()
  const paymentKey = paymentData.paymentKey // 실제 결제 트랜잭션 키

  // 4. subscriptions 테이블에 빌링키 및 구독 상태 업데이트
  // 기본 결제 주기인 30일 뒤를 만료일로 설정
  const now = new Date()
  const nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan: (paymentLog.planName.toLowerCase().includes('enterprise') ? 'enterprise' : 'pro') as any,
      status: 'active',
      billing_cycle: 'monthly',
      amount_krw: verifiedAmount,      
      currency: 'KRW',
      customer_key: customerKey,  // 빌링키 관리를 위한 고객 키
      billing_key: billingKey,    // 빌링키 저장
      invoice_number: `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      current_period_start: now.toISOString(),
      current_period_end: nextBillingDate.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (subError) {
    console.error('Subscription update failed details:', subError)
    
    // [Fallback] 최소한 users 테이블의 plan 다운그레이드 방지용 동기화 (트리거 실패 대비)
    console.warn('Attempting fallback: Updating users table directly...')
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ plan: 'pro', updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (userUpdateError) {
       console.error('User plan fallback update failed:', userUpdateError)
       throw new Error(`구독 정보 업데이트에 실패했습니다. 관리자에게 문의하세요.`)
    }
  }

  // 5. payment_logs 상태 업데이트 (SUCCESS)
  const { error: logError } = await supabase
    .from('payment_logs')
    .update({ 
       status: 'SUCCESS',
       payment_key: paymentKey,
       updated_at: new Date().toISOString()
    })
    .eq('order_id', orderId)
    
  if (logError) {
    console.warn('Failed to update payment_log status to SUCCESS:', logError)
  }

  return { success: true }
}
