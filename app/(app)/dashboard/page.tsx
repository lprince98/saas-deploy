import React from 'react'
import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { SideNavBar } from '@/src/presentation/components/shared/SideNavBar'
import Link from 'next/link'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { Card } from '@/src/presentation/components/ui/Card'
import { IconBox } from '@/src/presentation/components/ui/IconBox'
import { Container } from '@/src/presentation/components/ui/Container'
import { Input } from '@/src/presentation/components/ui/Input'

import { createNoteAction } from '@/src/application/actions/noteActions'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'
import { seedNotesAction } from './seed-action'
import { CancelSubscriptionButton } from '@/src/presentation/components/payment/CancelSubscriptionButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '나의 갤러리 — CloudNote',
  description: '당신의 사유가 큐레이션되는 공간. 오늘 기록한 영감을 확인하세요.',
  openGraph: {
    title: '나의 갤러리 — CloudNote Dashboard',
    description: '개인적인 성찰과 지적 아카이브',
    images: ['/og-image.png'],
  },
}

/**
 * 대시보드 서버 컴포넌트
 */
export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const noteRepo = new SupabaseNoteRepository(supabase)
  const userRepo = new SupabaseUserRepository()
  const noteUseCases = new NoteUseCases(noteRepo, userRepo)
  
  const allNotes = await noteUseCases.getUserNotes(user.id)
  const subscription = await userRepo.getUserSubscription(user.id)
  const userPlan = subscription?.plan || 'free'
  const subStatus = subscription?.status || 'expired'
  
  const pinnedNotes = allNotes.filter(n => n.isPinned)
  const recentNotes = allNotes.slice(0, 5)

  const isAtLimit = userPlan === 'free' && allNotes.length >= 10

  return (
    <Container className="py-12 space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
      {/* Welcome */}
      <section className="space-y-6">
        {isAtLimit && (
          <Card className="p-4 bg-amber-50 border-amber-200 flex items-center justify-between animate-in zoom-in duration-500">
            <div className="flex items-center gap-3 text-amber-800">
              <span className="material-symbols-outlined">warning</span>
              <p className="font-medium font-inter text-sm">무료 플랜의 노트 한도(10개)에 도달했습니다. 새로운 노트를 작성하려면 프로로 업그레이드하세요.</p>
            </div>
            <Link href="/pricing">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-transparent">업그레이드</Button>
            </Link>
          </Card>
        )}
        
        {/* 구독 관리 배너 (Pro/Enterprise 대상) */}
        {userPlan !== 'free' && (
          <Card className="p-4 bg-blue-50/50 border-blue-200 flex items-center justify-between animate-in zoom-in duration-500">
            <div className="flex items-center gap-3 text-[#24389c]">
              <span className="material-symbols-outlined font-bold">verified</span>
              <div>
                <p className="font-medium font-inter text-sm">
                  {userPlan === 'pro' ? '프로 큐레이터' : '엔터프라이즈'} 플랜 혜택을 이용 중입니다.
                </p>
                {subStatus === 'canceled' && (
                  <p className="text-xs text-slate-500 mt-1">다음 결제일에 만료 처리되며 더 이상 청구되지 않습니다.</p>
                )}
              </div>
            </div>
            {subStatus === 'active' && <CancelSubscriptionButton />}
          </Card>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-5xl font-extrabold text-[#191c1e] tracking-tight mb-2">
              좋은 아침입니다, {user.email?.split('@')[0]}님.
            </h2>
            <p className="text-[#4a626d] font-inter text-lg">
              오늘을 위해 큐레이션된 생각들이 검토를 기다리고 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {allNotes.length === 0 && (
              <form action={seedNotesAction}>
                <Button variant="outline" size="sm" type="submit">샘플 데이터 생성</Button>
              </form>
            )}
            <form action={createNoteAction}>
              <Button variant="primary" size="sm" type="submit" className="gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                새 노트 작성
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Bento Grid (Pinned Notes) */}
      <section className="grid grid-cols-12 gap-6 h-auto">
        {pinnedNotes.length > 0 ? (
           pinnedNotes.map((note, idx) => (
              <Link 
                key={note.id}
                href={`/notes/${note.id}`}
                className={`${idx === 0 ? 'col-span-12 lg:col-span-7' : 'col-span-12 lg:col-span-5'} flex`}
              >
                <Card hover className="p-8 flex flex-col w-full group">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="info">{note.category || '일반'}</Badge>
                    <span className="text-xs text-slate-400 font-inter">
                      {note.updatedAt?.toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-[#191c1e] mb-4 leading-tight group-hover:text-[#24389c] transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-slate-500 line-clamp-3 mb-8 text-lg font-inter leading-relaxed">
                    {typeof note.content === 'string' ? note.content : '내용을 확인하려면 클릭하세요.'}
                  </p>
                  <div className="mt-auto flex items-center gap-2">
                     <IconBox icon="star" size="sm" className="bg-transparent" />
                     <span className="text-xs text-slate-400 font-medium font-manrope">중요 노트</span>
                  </div>
                </Card>
              </Link>
           ))
        ) : (
          <Card className="col-span-12 bg-[#f2f4f7] border-2 border-dashed border-slate-300 h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
             <IconBox icon="inventory_2" variant="ghost" size="lg" />
             <p className="font-medium font-inter">고정된 노트가 없습니다.</p>
             <form action={createNoteAction}>
                <Button variant="outline" size="sm" type="submit">새 노트 작성하기</Button>
             </form>
          </Card>
        )}
        
        {/* Today's Insight */}
        <Card variant="accent" className="col-span-12 p-10 relative overflow-hidden group border-transparent">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <IconBox icon="lightbulb" variant="pill" size="sm" className="bg-white/20 text-white" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#cacfff]">오늘의 통찰</span>
              </div>
              <p className="font-headline text-3xl font-semibold text-white max-w-3xl leading-snug tracking-tight">
                "정보는 지식이 아닙니다. 지식의 유일한 원천은 경험입니다. 경험은 큐레이션된 기억입니다!!!"
              </p>
              <p className="mt-6 text-[#cacfff] text-base italic font-inter opacity-80">— 에디토리얼 다이제스트, 2024년</p>
           </div>
           {/* Background detail */}
           <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
        </Card>
      </section>

      {/* Recent Notes List */}
      <section className="space-y-8 pb-12">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-headline text-2xl font-bold text-[#191c1e]">최근 큐레이션</h3>
          <div className="flex items-center gap-3 bg-slate-200/50 p-1.5 rounded-xl">
            <Button variant="ghost" className="p-2 h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm">
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </Button>
            <Button variant="primary" className="p-2 h-9 w-9 bg-white text-[#24389c] shadow-sm rounded-lg">
              <span className="material-symbols-outlined font-bold text-[20px]">list</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => (
              <Link 
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex group"
              >
                <Card hover className="flex-1 flex items-center p-6 bg-white hover:bg-slate-50 transition-all border-slate-200/50 rounded-2xl">
                  <IconBox icon="article" className="mr-6 group-hover:bg-[#24389c] group-hover:text-white" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#191c1e] group-hover:text-[#24389c] transition-colors font-headline text-lg">{note.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1 font-inter opacity-80">
                      {typeof note.content === 'string' ? note.content : '내용 미리보기 없음'}
                    </p>
                  </div>
                  <div className="flex items-center gap-12 text-sm text-slate-400 font-manrope px-4">
                    <div className="flex items-center gap-2 group-hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined text-sm">folder</span>
                      <span className="font-semibold">{note.category || '기본'}</span>
                    </div>
                    <span className="w-24 text-right font-medium">어제</span>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <p className="text-center py-12 text-slate-400 font-inter">작성된 노트가 없습니다.</p>
          )}
        </div>
        
        <div className="flex justify-center pt-8">
           <Link href="/dashboard">
             <Button variant="outline" className="text-[#24389c] font-bold text-sm hover:translate-x-1 px-8 py-6 rounded-xl gap-2 transition-all">
                모든 노트 및 아카이브 보기
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
             </Button>
           </Link>
        </div>
      </section>
    </Container>
  )
}

