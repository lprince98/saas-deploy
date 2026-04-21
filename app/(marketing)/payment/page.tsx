'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container } from '@/src/presentation/components/ui/Container'
import { Checkout } from '@/src/presentation/components/payment/Checkout'
import { Card } from '@/src/presentation/components/ui/Card'
import { Badge } from '@/src/presentation/components/ui/Badge'

function PaymentContent() {
  const searchParams = useSearchParams()
  const planName = searchParams.get('plan') || 'Pro'
  const amount = parseInt(searchParams.get('amount') || '12000', 10)

  return (
    <Container className="py-20 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 space-y-8">
           <div className="space-y-2">
              <h1 className="text-4xl font-extrabold font-headline text-[#191c1e] tracking-tight">주문 요약.</h1>
              <p className="text-[#4a626d] font-inter">선택하신 요금제의 혜택을 곧 누리실 수 있습니다.</p>
           </div>

           <Card className="p-8 border-slate-200/50 bg-white/50 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <Badge variant="info" className="mb-2 uppercase tracking-widest text-[10px]">Selected Plan</Badge>
                    <h3 className="text-2xl font-bold font-headline text-[#191c1e] capitalize">{planName} Curator</h3>
                 </div>
                 <span className="text-2xl font-extrabold font-headline text-[#24389c]">₩{amount.toLocaleString()}</span>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-200/50">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-inter">구독 기간</span>
                    <span className="text-[#191c1e] font-semibold">1개월 (자동 갱신)</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-inter">세금 (0%)</span>
                    <span className="text-[#191c1e] font-semibold">₩0</span>
                 </div>
                 <div className="flex justify-between text-xl pt-4 font-bold font-headline border-t border-slate-200/50 mt-4">
                    <span className="text-[#191c1e]">총 결제 금액</span>
                    <span className="text-[#24389c]">₩{amount.toLocaleString()}</span>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-[#f7f9fc] rounded-2xl border border-slate-200/50">
              <p className="text-sm text-[#4a626d] font-inter leading-relaxed">
                 결제 즉시 모든 프로 기능을 사용할 수 있으며, 구독 기간이 종료되기 24시간 전에 자동으로 갱신됩니다. 언제든지 계정 설정에서 구독을 관리하거나 취소할 수 있습니다.
              </p>
           </div>
        </div>

        {/* Right: Payment Widget */}
        <div className="lg:col-span-7">
           <Checkout 
              amount={amount} 
              orderId={`order-${Math.random().toString(36).slice(2, 11)}`} 
              orderName={`${planName} Curator Plan`} 
           />
        </div>
      </div>
    </Container>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
