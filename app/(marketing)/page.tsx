import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { SectionHeader } from '@/src/presentation/components/ui/SectionHeader'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'

/**
 * 랜딩 페이지 컴포넌트
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <Container className="py-20 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <Badge variant="info">New: AI 기반 문맥 검색 기능 출시</Badge>
              <h1 className="text-6xl md:text-7xl font-headline font-extrabold tracking-tighter text-[#191c1e] leading-[1.1]">
                당신의 사유를 위한 <br/>
                <span className="text-[#24389c] italic">디지털 갤러리.</span>
              </h1>
              <p className="text-xl text-[#4a626d] max-w-lg leading-relaxed font-inter">
                복잡한 리스트에서 벗어나세요. The Digital Curator는 당신의 아이디어, 연구, 일상의 영감을 위한 고대비의 감각적인 에디토리얼 환경을 제공합니다.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="px-10">무료로 시작하기</Button>
                </Link>
                <Button variant="ghost" size="lg">데모 보기</Button>
              </div>
            </div>
            
            <div className="flex-1 relative animate-in fade-in slide-in-from-right duration-1000">
              <Card variant="bento" className="relative z-10 p-2 overflow-hidden border-slate-200/50 shadow-2xl">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/auth-preview-desk.png"
                    alt="Editor UI Preview"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </Card>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#24389c]/5 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#cde6f4]/30 rounded-full blur-[100px]"></div>
            </div>
          </Container>
        </section>

        {/* Bento Features Grid */}
        <section className="bg-[#f2f4f7]">
          <Container className="py-24">
            <SectionHeader 
              title="모든 디테일에 담긴 정교함." 
              subtitle="소음보다는 명확함의 가치를 아는 분들을 위해 설계되었습니다. 우리는 톤의 깊이와 건축적 정밀함에 집중합니다."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
              {/* Large Feature: Rich Text */}
              <Card variant="bento" className="md:col-span-2 row-span-2 p-10 flex flex-col justify-between hover:scale-[1.01]">
                <div className="max-w-md space-y-4">
                  <IconBox icon="edit_note" size="lg" />
                  <h3 className="text-3xl font-headline font-bold text-[#191c1e]">리치 텍스트 에디토리얼 슈트</h3>
                  <p className="text-[#4a626d] leading-relaxed font-inter">
                    프리미엄 에디토리얼 레이아웃을 닮은 집필 환경을 경험하세요. 자동화된 계층 구조, 의도적인 여백, 그리고 방해 요소 없는 몰입을 제공합니다.
                  </p>
                </div>
                <div className="relative h-48 w-full rounded-lg overflow-hidden mt-8 grayscale opacity-60">
                   <Image src="/auth-preview-gallery.png" alt="Editorial Suite" fill className="object-cover" />
                </div>
              </Card>

              {/* Small Feature: Cloud Sync */}
              <Card className="bg-[#e0e3e6] p-8 flex flex-col justify-center text-center hover:-translate-y-2">
                <IconBox icon="cloud_sync" className="mx-auto mb-4" />
                <h3 className="text-xl font-headline font-bold text-[#191c1e] mb-2">클라우드 동기화</h3>
                <p className="text-[#4a626d] text-sm font-inter">모든 기기에서 당신의 생각을 즉각적이고 안전하게 미러링합니다.</p>
              </Card>

              {/* Small Feature: Smart Search */}
              <Card variant="accent" className="p-8 flex flex-col justify-center text-center hover:-translate-y-2">
                <IconBox icon="manage_search" variant="glass" className="mx-auto mb-4" />
                <h3 className="text-xl font-headline font-bold mb-2">스마트 검색</h3>
                <p className="text-[#cacfff] text-sm opacity-80 font-inter">단순한 키워드를 넘어 의도까지 파악하는 문맥적 발견 기능입니다.</p>
              </Card>

              {/* Horizontal Feature */}
              <Card className="md:col-span-3 bg-[#f2f4f7] p-10 flex flex-col md:flex-row items-center gap-12 mt-4">
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-headline font-bold text-[#191c1e]">보편적 접근성</h3>
                  <p className="text-[#4a626d] font-inter">
                    웹 앱, 네이티브 데스크톱 클라이언트, 모바일 컴패니언으로 어디서나 이용 가능합니다. 영감이 떠오르는 모든 곳에서 Curator는 기록할 준비가 되어 있습니다.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline" className="px-6 py-3 bg-white shadow-sm font-semibold gap-2">
                    <span className="material-symbols-outlined">laptop_mac</span> macOS
                  </Badge>
                  <Badge variant="outline" className="px-6 py-3 bg-white shadow-sm font-semibold gap-2">
                    <span className="material-symbols-outlined">smartphone</span> iOS
                  </Badge>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Social Proof */}
        <section>
          <Container className="py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <SectionHeader 
                align="left"
                title="전 세계 큐레이터들의 사랑을 받습니다." 
                subtitle="생각의 프로세스를 한 단계 높인 50,000명 이상의 전문가들과 함께하세요."
                className="mb-0"
              />
              <div className="flex gap-2 pb-4">
                <Button variant="outline" className="p-3 rounded-full h-12 w-12">
                  <span className="material-symbols-outlined">arrow_back</span>
                </Button>
                <Button variant="outline" className="p-3 rounded-full h-12 w-12">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Marcus Chen',
                  role: 'Flux 크리에이티브 디렉터',
                  text: '"마침내 스프레드시트처럼 느껴지지 않는 노트 앱을 찾았습니다. 타이포그래피와 여백 덕분에 글을 쓰면서 진정으로 깊게 생각할 수 있습니다."'
                },
                {
                  name: 'Elena Rodriguez',
                  role: 'PhD 연구원',
                  text: '"The Digital Curator는 연구 논문을 위한 강력한 기능과 저널링을 위한 아름다움을 동시에 갖춘 유일한 도구입니다."'
                }
              ].map((review, idx) => (
                <Card key={idx} className="p-10 bg-[#f2f4f7] border-slate-200/30 space-y-6 hover:bg-white transition-colors">
                  <div className="flex gap-1 text-[#24389c]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-xl font-inter leading-relaxed text-[#191c1e]">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300"></div>
                    <div>
                      <p className="font-bold text-[#191c1e]">{review.name}</p>
                      <p className="text-sm text-[#4a626d] font-inter">{review.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section>
          <Container className="py-24">
            <Card variant="accent" className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">당신의 레거시를 큐레이팅할 준비가 되셨나요?</h2>
                <p className="text-[#cacfff] text-lg max-w-xl mx-auto opacity-80 font-inter">
                  지금 14일 무료 프리미엄 트라이얼을 시작하세요. 신용카드는 필요 없습니다. 디지털 갤러리의 차이를 경험해 보세요.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/signup">
                    <Button variant="dark" size="lg" className="bg-white text-[#24389c] hover:bg-slate-50 min-w-[200px]">
                      무료로 시작하기
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 min-w-[200px]">
                    상담 신청하기
                  </Button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-24 -mt-24 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-12 -mb-12 blur-[80px]"></div>
            </Card>
          </Container>
        </section>
      </main>
    </div>
  )
}
