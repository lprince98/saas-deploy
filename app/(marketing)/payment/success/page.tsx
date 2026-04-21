import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'
import { SuccessHandler } from '@/src/presentation/components/payment/SuccessHandler'

/**
 * 결제 완료 페이지 컴포넌트
 */
export default function PaymentSuccessPage() {
  return (
    <main className="relative min-h-[calc(100vh-72px)] flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#f7f9fc]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <SuccessHandler />
      </div>
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#24389c]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4a626d]/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Welcome Message */}
        <div className="lg:col-span-7 space-y-8 pt-12 animate-in fade-in slide-in-from-bottom duration-1000">
          <Badge variant="info" className="gap-2">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            결제가 완료되었습니다
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-[1.1] text-[#24389c]">
            이너 서클에 <br/>오신 것을 환영합니다.
          </h1>
          
          <p className="text-xl text-[#454652] max-w-lg font-inter leading-relaxed">
            <span className="text-[#24389c] font-semibold">프로 큐레이터</span>로의 업그레이드가 완료되었습니다. 세련된 명확함과 집중력 있는 환경에서 생각을 정리해 보세요.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="flex items-center gap-2">
                대시보드로 이동
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </Link>
            <Button variant="ghost" size="lg">리소스 보기</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            {[
              { 
                icon: 'auto_awesome', 
                title: 'AI 큐레이션', 
                text: '큐레이터 엔진이 노트를 자동으로 태그하고 연결해 드립니다.' 
              },
              { 
                icon: 'cloud_done', 
                title: '무제한 동기화', 
                text: '종단간 암호화 기술로 모든 기기에서 디지털 보관함에 접속하세요.' 
              }
            ].map((feature, i) => (
              <Card key={i} hover className="p-6 transition-all border-slate-200/50">
                <IconBox icon={feature.icon} className="mb-3" />
                <h3 className="font-headline font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-[#4a626d] font-inter">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side: Invoice Summary */}
        <aside className="lg:col-span-5 animate-in fade-in zoom-in duration-1000 delay-300">
          <Card variant="glass" className="p-8 border-slate-200/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold font-headline tracking-tight text-[#191c1e]">영수증 요약</h2>
              <span className="text-xs font-mono text-[#757684] uppercase tracking-widest">INV-2024-8842</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f2f4f7]">
                <IconBox icon="workspace_premium" variant="secondary" className="bg-[#3f51b5] text-white" />
                <div>
                  <p className="font-bold text-[#191c1e] text-sm">프로 큐레이터 플랜</p>
                  <p className="text-xs text-[#4a626d]">연간 구독</p>
                </div>
                <div className="ml-auto font-bold text-[#191c1e] text-sm font-manrope">$144.00</div>
              </div>

              <div className="space-y-3 px-1 font-manrope">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a626d]">소계</span>
                  <span className="text-[#191c1e] font-medium">$144.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4a626d]">세금 (0%)</span>
                  <span className="text-[#191c1e] font-medium">$0.00</span>
                </div>
                <div className="pt-3 flex justify-between items-center border-t border-dashed border-slate-200">
                  <span className="font-headline font-bold text-lg">총 결제 금액</span>
                  <span className="font-headline font-extrabold text-2xl text-[#24389c]">$144.00</span>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <IconBox icon="credit_card" variant="ghost" className="p-2 bg-white rounded-md shadow-sm h-10 w-10" />
                <div className="text-sm font-manrope">
                  <p className="text-[#4a626d] text-xs">결제 수단</p>
                  <p className="font-medium text-[#191c1e]">Visa (끝자리 4242)</p>
                </div>
              </div>

              <Button variant="ghost" className="w-full text-[#24389c] bg-transparent hover:bg-slate-50 gap-2">
                <span className="material-symbols-outlined text-sm">download</span>
                PDF 영수증 다운로드
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-4">
               <div className="text-indigo-900/20 font-headline font-bold text-xl tracking-tighter grayscale">
                  The Digital Curator
               </div>
               <p className="text-[10px] text-[#757684] uppercase tracking-[0.2em] font-bold">50,000명 이상의 큐레이터가 선택했습니다</p>
            </div>
          </Card>

          <Card className="mt-6 p-6 bg-[#cde6f4] text-[#051e28] flex items-center gap-5 border border-blue-200/20">
            <IconBox icon="help_center" size="lg" className="bg-transparent" />
            <div>
              <p className="font-bold font-headline">도움이 필요하신가요?</p>
              <p className="text-sm opacity-80 font-inter">프로 회원을 위해 전담 컨시어지가 24시간 대기 중입니다.</p>
            </div>
          </Card>
        </aside>
      </div>

      {/* Decorative Blob */}
      <div className="fixed bottom-0 right-0 -z-10 w-1/3 opacity-10 pointer-events-none grayscale">
         <Image src="/auth-preview-gallery.png" alt="Decorative background" width={800} height={1200} className="w-full h-auto" />
      </div>
    </main>
  )
}
