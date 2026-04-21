'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { completePurchaseAction } from '@/src/application/actions/completePurchaseAction'

/**
 * 결제 성공 페이지에서 서버에 구독 상태 업데이트를 요청하는 핸들러.
 * 빌링키 발급 콜백으로 전달되는 authKey와 customerKey를 처리합니다.
 */
export function SuccessHandler() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    async function updateSubscription() {
      // 컴포넌트가 마운트될 때 한 번만 실행되도록
      // 토스 빌링 성공 파라미터 확인
      const authKey = searchParams.get('authKey')
      const customerKey = searchParams.get('customerKey')
      
      const orderId = searchParams.get('orderId') || ''
      const amount = parseInt(searchParams.get('amount') || '0', 10)
      const planName = searchParams.get('planName') || 'Pro'

      // 만약 이미 백엔드 처리가 끝난 상태라면 (ex. 새로고침) 방어 로직 필요 시 추가 가능
      
      if (!authKey || !customerKey || !orderId) {
         setError('비정상적인 접근이거나 파라미터가 누락되었습니다.')
         setLoading(false)
         return
      }

      try {
        await completePurchaseAction(authKey, customerKey, orderId, amount, planName)
        setLoading(false)
        
        // 결제 키 등 중요 정보가 URL에 남지 않도록 정리
        router.replace('/payment/success')
      } catch (err: any) {
        console.error(err)
        setError(err.message || '인증 정보를 처리하는 중 오류가 발생했습니다.')
        setLoading(false)
      }
    }

    // React Strict Mode 등에서 두 번 호출되는 것을 방지하기 위해 
    // 파라미터가 정확히 존재할 때만 실행
    if (searchParams.get('authKey')) {
      updateSubscription()
    } else {
      // authKey가 없다면 이미 처리 완료되어 URL이 정리된 상태일 가능성이 높음
      setLoading(false)
    }
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 font-inter animate-pulse bg-white/80 p-3 rounded-lg shadow-sm border border-slate-200/50">
        <span className="material-symbols-outlined spin">sync</span>
        <span className="text-sm font-medium">안전하게 정기결제를 등록하고 있습니다...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-error font-inter bg-red-50/90 p-3 rounded-lg shadow-sm border border-red-100">
        <span className="material-symbols-outlined">report</span>
        <span className="text-sm font-bold">{error}</span>
      </div>
    )
  }

  return null
}
