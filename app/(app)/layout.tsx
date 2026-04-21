import React from 'react'
import { SideNavBar } from '@/src/presentation/components/shared/SideNavBar'
import { DashboardHeader } from '@/src/presentation/components/shared/DashboardHeader'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'

/**
 * 로그인 후 앱 전용 레이아웃 (Dashboard, Notes)
 * 사이드바와 대시보드 전용 헤더를 포함합니다.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userName = '큐레이터'
  let plan = 'free'

  if (user) {
    userName = user.email?.split('@')[0] || '큐레이터'
    const userRepo = new SupabaseUserRepository()
    const subscription = await userRepo.getUserSubscription(user.id)
    plan = subscription?.plan || 'free'
  }

  return (
    <div className="flex bg-[#f7f9fc] min-h-screen">
      <SideNavBar userName={userName} plan={plan} />

      <div className="flex-1 flex flex-col ml-64 min-h-screen relative">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
