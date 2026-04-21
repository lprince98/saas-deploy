'use client'

import React, { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Container } from '@/src/presentation/components/ui/Container'
import { Card } from '@/src/presentation/components/ui/Card'
import { Button } from '@/src/presentation/components/ui/Button'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { updatePaymentLogStatusAction } from '@/src/application/actions/updatePaymentLogStatusAction'

function FailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const code = searchParams.get('code')
  const message = searchParams.get('message') || '알 수 없는 에러가 발생했습니다.'
  const orderId = searchParams.get('orderId')

  const isCancelled = code === 'PAY_PROCESS_CANCELED'
  const title = isCancelled ? '결제를 취소했습니다.' : '결제에 실패했습니다.'
  const displayMessage = isCancelled 
    ? '결제 과정을 중단하여 결제가 이루어지지 않았습니다.' 
    : message

  // DB 상태 업데이트
  useEffect(() => {
    if (orderId) {
      updatePaymentLogStatusAction(
        orderId, 
        isCancelled ? 'CANCELLED' : 'FAILED', 
        message
      ).catch(err => {
         console.error('Failed to log payment failure:', err)
      })
    }
  }, [orderId, isCancelled, message])

  return (
    <Container className="min-h-screen py-20 max-w-2xl flex flex-col items-center justify-center">
       <Card className="w-full relative overflow-hidden backdrop-blur-xl bg-white/80 border-slate-200/50 shadow-2xl p-10 text-center">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-rose-400"></div>
            
            <div className="flex justify-center mb-8">
               <div className="relative">
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-[1.5] opacity-50 blur-md"></div>
                  <IconBox 
                     icon={isCancelled ? "block" : "error"} 
                     variant="ghost" 
                     className="bg-red-50 text-red-500 border border-red-100 w-20 h-20 relative z-10" 
                     size="lg" 
                  />
               </div>
            </div>

            <h1 className="text-3xl font-bold font-headline text-[#191c1e] tracking-tight mb-4">{title}</h1>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 inline-block mb-10 w-full max-w-sm mx-auto">
               <p className="text-[#4a626d] font-inter text-sm break-keep">{displayMessage}</p>
               {code && !isCancelled && (
                  <p className="text-slate-400 font-mono text-[11px] mt-2 bg-slate-100 inline-block px-2 py-1 rounded">Code: {code}</p>
               )}
               {orderId && (
                  <p className="text-slate-400 font-mono text-[11px] mt-2">Order: {orderId}</p>
               )}
            </div>

            <div className="flex gap-4 w-full max-w-sm mx-auto">
                <Button 
                   variant="ghost" 
                   onClick={() => router.push('/dashboard')}
                   className="w-full text-slate-500 hover:text-slate-800"
                >
                   대시보드로
                </Button>
                <Button 
                   onClick={() => router.push('/payment')}
                   className="w-full shadow-lg bg-slate-800 hover:bg-slate-900 border-none text-white"
                >
                   다시 시도하기
                </Button>
            </div>
       </Card>
    </Container>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
       <FailContent />
    </Suspense>
  )
}
