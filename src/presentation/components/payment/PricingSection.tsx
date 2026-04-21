'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'

/**
 * 요금제 선택 및 가격 표시를 담당하는 클라이언트 컴포넌트
 */
export function PricingSection() {
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
    <section>
      <Container className="text-center mb-20 max-w-4xl">
        {/* Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-20 animate-in fade-in zoom-in duration-700">
          <span className={`text-sm font-semibold font-manrope ${!isAnnual ? 'text-[#191c1e]' : 'text-[#4a626d]'}`}>월간 결제</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-[#eceef1] rounded-full p-1 relative transition-colors duration-300"
            aria-label="결제 주기 전환"
          >
            <div className={`w-6 h-6 bg-[#24389c] rounded-full absolute transition-all duration-300 ${isAnnual ? 'right-1' : 'left-1'} shadow-sm`}></div>
          </button>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold font-manrope ${isAnnual ? 'text-[#191c1e]' : 'text-[#4a626d]'}`}>연간 결제</span>
            <Badge variant="info" className="text-[10px] uppercase font-bold">20% 절약</Badge>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch text-left">
          {plans.map((plan, idx) => (
            <Card 
              key={plan.name}
              variant={plan.highlighted ? 'accent' : 'default'}
              className={plan.highlighted 
                ? 'scale-105 z-10 p-8 flex flex-col border-transparent shadow-2xl animate-in fade-in slide-in-from-bottom duration-1000' 
                : `p-8 flex flex-col hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-700 delay-${idx*100}`}
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
                  className={plan.highlighted ? 'w-full bg-white text-[#24389c] hover:bg-slate-50 font-bold' : 'w-full'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
