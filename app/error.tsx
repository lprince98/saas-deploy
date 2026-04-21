'use client'

import React, { useEffect } from 'react'
import { Button } from '@/src/presentation/components/ui/Button'
import { Container } from '@/src/presentation/components/ui/Container'
import { IconBox } from '@/src/presentation/components/ui/IconBox'

/**
 * 전역 에러 바운더리
 * 프리미엄 명조/고딕 타이포그래피와 어두운 네이비 배경을 활용합니다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로그 기록 (실제 서비스에서는 Sentry 등에 전송)
    console.error('GLOBAL ERROR CAUGHT:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-6">
      <Container className="max-w-2xl text-center">
        <div className="mb-12 relative inline-block">
           <div className="absolute inset-0 bg-[#24389c]/10 blur-3xl rounded-full"></div>
           <IconBox icon="warning" size="lg" className="relative z-10 bg-[#24389c] text-white shadow-2xl h-24 w-24" />
        </div>
        
        <h1 className="font-headline text-5xl font-extrabold text-[#191c1e] tracking-tight mb-6">
          이런, 사유의 정원에서 길을 잃었습니다.
        </h1>
        
        <p className="text-[#4a626d] font-inter text-xl mb-12 leading-relaxed">
          예기치 못한 기술적 문제가 발생했습니다. 관리자에게 이미 알림이 전송되었습니다. 
          잠시 후 다시 시도해 보시겠습니까?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
             variant="primary" 
             onClick={() => reset()}
             className="px-10 py-7 rounded-2xl bg-[#24389c] text-white font-bold text-lg shadow-xl hover:translate-y-[-2px] transition-all"
          >
             다시 시도하기
          </Button>
          <Button 
             variant="ghost" 
             onClick={() => window.location.href = '/'}
             className="px-10 py-7 rounded-2xl border-slate-200 text-slate-500 font-bold text-lg hover:bg-white"
          >
             홈으로 이동
          </Button>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200">
           <p className="text-xs text-slate-400 font-manrope uppercase tracking-widest">
              Error Digest: {error.digest || 'Internal Server Error'}
           </p>
        </div>
      </Container>
    </div>
  )
}
