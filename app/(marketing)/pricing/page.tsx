'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { SectionHeader } from '@/src/presentation/components/ui/SectionHeader'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'

/**
 * 요금제 페이지 컴포넌트
 */
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: '무료 (Free)',
      price: '0',
      period: '/평생',
      description: '큐레이션 여정을 시작하기 위한 필수 도구입니다.',
      features: ['최대 100개의 노트', '마크다운 지원'],
      locked: ['협업용 노트북', '우선 지원 서비스'],
      cta: '큐레이션 시작하기',
      highlighted: false,
    },
    {
      name: '프로 (Pro)',
      price: isAnnual ? '12,000' : '15,000',
      period: '/월',
      description: '디지털 아카이브의 잠재력을 최대한으로 발휘하세요.',
      features: [
        '무제한 노트 및 저장 공간',
        '고급 검색 및 OCR',
        '양방향 링크 기능',
        '커스텀 도메인 갤러리',
        '우선 순위 이메일 지원',
      ],
      locked: [],
      cta: '프로로 업그레이드',
      highlighted: true,
    },
    {
      name: '엔터프라이즈 (Enterprise)',
      price: '65,000',
      period: '/월',
      description: '팀과 기관을 위한 확장 가능한 인델리전스.',
      features: [
        'Pro 요금제의 모든 기능',
        'SSO 및 SAML 통합',
        '관리자 대시보드',
        '전담 성공 매니저',
      ],
      locked: [],
      cta: '영업팀에 문의하기',
      highlighted: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="pt-20">
          <Container className="text-center mb-20 max-w-4xl">
            <SectionHeader 
              title="명료함의 가치." 
              subtitle="지적 유산을 담기 위한 완벽한 캔버스를 선택하세요. 개인적인 성찰부터 전 세계적인 아카이브까지."
            />

            {/* Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-semibold font-manrope ${!isAnnual ? 'text-[#191c1e]' : 'text-[#4a626d]'}`}>월간 결제</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-8 bg-[#eceef1] rounded-full p-1 relative transition-colors duration-300"
              >
                <div className={`w-6 h-6 bg-[#24389c] rounded-full absolute transition-all duration-300 ${isAnnual ? 'right-1' : 'left-1'}`}></div>
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold font-manrope ${isAnnual ? 'text-[#191c1e]' : 'text-[#4a626d]'}`}>연간 결제</span>
                <Badge variant="info" className="text-[10px] uppercase font-bold">20% 절약</Badge>
              </div>
            </div>
          </Container>
        </section>

        {/* Pricing Grid */}
        <section>
          <Container className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                variant={plan.highlighted ? 'accent' : 'default'}
                className={plan.highlighted ? 'scale-105 z-10 p-8 flex flex-col' : 'p-8 flex flex-col hover:-translate-y-2'}
              >
                <div className="mb-8">
                  <h3 className={`text-lg font-bold mb-2 font-headline ${plan.highlighted ? 'text-[#cacfff]' : 'text-[#4a626d]'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline space-x-1 mb-4">
                    <span className={`text-4xl font-extrabold tracking-tighter font-headline ${plan.highlighted ? 'text-white' : 'text-[#191c1e]'}`}>
                      ₩{plan.price}
                    </span>
                    <span className={`font-medium font-manrope ${plan.highlighted ? 'text-[#cacfff]' : 'text-[#4a626d]'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed font-inter ${plan.highlighted ? 'text-[#cacfff]/80' : 'text-[#4a626d]'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex-grow space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <span className={`material-symbols-outlined text-sm mt-0.5 ${plan.highlighted ? 'text-[#cacfff]' : 'text-[#24389c]'}`}>
                        check
                      </span>
                      <span className="text-sm font-inter">{feature}</span>
                    </div>
                  ))}
                  {plan.locked.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3 opacity-30">
                      <span className="material-symbols-outlined text-sm mt-0.5">lock</span>
                      <span className="text-sm font-inter">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/payment?plan=${plan.name.toLowerCase().split(' ')[0]}&amount=${plan.price.replace(',', '')}`} className="w-full">
                  <Button 
                    variant={plan.highlighted ? 'dark' : 'ghost'} 
                    className={plan.highlighted ? 'w-full bg-white text-[#24389c] hover:bg-slate-50' : 'w-full'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </Container>
        </section>

        {/* Feature Highlights */}
        <section className="mt-32">
          <Container>
            <SectionHeader 
              title="왜 The Digital Curator를 선택해야 할까요?" 
              decorator
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[500px]">
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

        {/* FAQ */}
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
