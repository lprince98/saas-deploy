import React from 'react'
import { SectionHeader } from '@/src/presentation/components/ui/SectionHeader'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'
import { Card } from '@/src/presentation/components/ui/Card'
import { PricingSection } from '@/src/presentation/components/payment/PricingSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '명료함의 가치 — CloudNote 요금제',
  description: '당신의 지적 유산을 담기 위한 완벽한 플랜을 선택하세요. 무료부터 엔터프라이즈까지.',
  openGraph: {
    title: 'CloudNote 요금표 — 명료함의 시작',
    description: '프리미엄 지식 관리의 새로운 기준',
    images: ['/og-image.png'],
  },
}

/**
 * 요금제 페이지 (서버 컴포넌트)
 * 최상단과 하단 고정 섹션은 서버에서 렌더링하고, 인터랙티브한 요금표 섹션만 클라이언트 컴포넌트로 분리합니다.
 */
export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-24">
        {/* Hero Section (Server rendered) */}
        <section className="pt-20">
          <Container className="text-center mb-10 max-w-4xl">
            <SectionHeader 
              title="명료함의 가치." 
              subtitle="지적 유산을 담기 위한 완벽한 캔버스를 선택하세요. 개인적인 성찰부터 전 세계적인 아카이브까지."
            />
          </Container>
        </section>

        {/* Pricing Interactive Section (Client rendered) */}
        <PricingSection />

        {/* Feature Highlights (Server rendered) */}
        <section className="mt-32">
          <Container>
            <SectionHeader 
              title="왜 The Digital Curator를 선택해야 할까요?" 
              decorator
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[500px]">
              <Card variant="bento" className="md:col-span-2 md:row-span-2 p-8 relative overflow-hidden flex flex-col justify-end group">
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent"></div>
                 <div className="relative z-10 space-y-4">
                    <IconBox icon="auto_awesome" size="lg" />
                    <h4 className="text-2xl font-headline font-bold text-[#191c1e]">신경망 조직화</h4>
                    <p className="text-[#4a626d] max-w-md font-inter">당신이 미처 깨닫지 못했던 아이디어들 사이의 연결 고리를 AI가 매핑합니다.</p>
                 </div>
              </Card>
              <Card className="bg-[#cde6f4] md:col-span-2 p-8 flex items-center justify-between">
                 <div className="space-y-2">
                    <h4 className="text-xl font-headline font-bold text-[#191c1e]">글로벌 동기화</h4>
                    <p className="text-sm text-[#506873] font-inter">어떤 기기에서든 당신의 아카이브에 실시간으로 접속하세요.</p>
                 </div>
                 <IconBox icon="cloud_sync" variant="secondary" size="lg" className="bg-transparent" />
              </Card>
              <Card className="bg-[#e6e8eb] p-6 flex flex-col justify-center text-center space-y-2">
                 <span className="material-symbols-outlined text-3xl text-[#24389c]">security</span>
                 <h5 className="font-headline font-bold text-[#191c1e]">강력한 암호화</h5>
              </Card>
              <Card className="bg-[#dee0ff] p-6 flex flex-col justify-center text-center space-y-2">
                 <span className="material-symbols-outlined text-3xl text-[#24389c]">history</span>
                 <h5 className="font-headline font-bold text-[#191c1e]">버전 스냅샷</h5>
              </Card>
            </div>
          </Container>
        </section>

        {/* FAQ (Server rendered) */}
        <section className="mt-32">
          <Container className="max-w-3xl">
            <SectionHeader title="자주 묻는 질문" />
            <div className="space-y-4">
              {[
                { q: '구독을 언제든지 취소할 수 있나요?', a: '네, 계정 설정에서 언제든지 구독을 취소하실 수 있습니다.' },
                { q: '학생 할인이 있나요?', a: '인증된 학생은 Pro 요금제에 대해 50% 할인을 받으실 수 있습니다.' },
                { q: '노트 한도를 초과하면 어떻게 되나요?', a: '기존 노트는 읽기 및 편집이 가능하지만, 새 노트를 생성하려면 업그레이드가 필요합니다.' }
              ].map((faq, idx) => (
                <Card key={idx} className="p-6 bg-[#f2f4f7] border-slate-200/30">
                  <h4 className="font-bold mb-2 text-[#191c1e] font-headline">{faq.q}</h4>
                  <p className="text-sm text-[#4a626d] leading-relaxed font-inter">{faq.a}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </div>
  )
}
