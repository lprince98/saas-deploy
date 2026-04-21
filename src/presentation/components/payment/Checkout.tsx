'use client'

import React, { useEffect, useState } from 'react'
import { loadTossPayments, TossPaymentsPayment } from '@tosspayments/tosspayments-sdk'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { createPaymentLogAction } from '@/src/application/actions/createPaymentLogAction'

interface CheckoutProps {
  amount: number
  orderId: string
  orderName: string
}

// 클라이언트 키는 우선 환경변수에서 가져오고, 없으면 빌링 전용 테스트 키 사용
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_4vZnjEJeQVxJzDoab4d8PmOoBN0k"

export function Checkout({ amount, orderId, orderName }: CheckoutProps) {
  const [payment, setPayment] = useState<TossPaymentsPayment | null>(null)
  const [ready, setReady] = useState(false)
  const [customerKey] = useState(`cus_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`)

  useEffect(() => {
    async function initPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey)
        // 빌링 결제를 위한 payment 객체 초기화
        const paymentInstance = tossPayments.payment({
          customerKey,
        })
        setPayment(paymentInstance)
        setReady(true)
      } catch (error) {
        console.error("Error initializing toss payment instance:", error)
      }
    }

    initPayment()
  }, [customerKey])

  const handlePaymentRequest = async () => {
    // 1. 상태를 DB에 로깅 (STARTED)
    try {
      await createPaymentLogAction(orderId, amount, orderName)
    } catch (error) {
      console.error("Failed to create log:", error)
    }

    if (!payment) return

    try {
      // 2. 자동결제(빌링) 등록창 호출
      await payment.requestBillingAuth({
        method: "CARD", 
        // 성공 시 콜백 URL (백엔드 처리 시 필요한 orderId와 amount도 함께 넘김)
        successUrl: window.location.origin + `/payment/success?orderId=${orderId}&amount=${amount}&planName=${encodeURIComponent(orderName)}`,
        failUrl: window.location.origin + `/payment/fail?orderId=${orderId}`
      })
    } catch (error) {
      console.error("Error requesting billing auth:", error)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
      <Card className="p-8 border-slate-200/50 shadow-xl shadow-slate-200/20 bg-white/80 backdrop-blur-xl relative overflow-hidden text-center">
        <div className="flex flex-col items-center gap-4 mb-4">
           <IconBox icon="credit_card" variant="primary" size="lg" />
           <h2 className="text-2xl font-bold font-headline text-[#191c1e]">안전한 정기결제 등록</h2>
           <p className="text-slate-500 font-inter text-sm">
             결제 카드를 한 번만 등록하시면 매월 자동으로 안전하게 결제됩니다.<br/>
             지금 등록 시 토스페이먼츠의 강력한 보안 모듈을 통해 암호화 처리됩니다.
           </p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Button 
          onClick={handlePaymentRequest} 
          disabled={!ready}
          className="w-full py-8 text-lg font-bold shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-[#24389c] to-[#3f51b5] hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ready ? `카드 등록하고 정기구독 시작하기` : '결제 모듈 불러오는 중...'}
        </Button>
        <p className="text-center text-xs text-slate-400 font-inter group flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          안전하고 빠른 토스페이먼츠 결제 시스템을 사용합니다.
        </p>
      </div>
    </div>
  )
}
