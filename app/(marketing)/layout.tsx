import React from 'react'
import { TopNavBar } from '@/src/presentation/components/shared/TopNavBar'
import { Footer } from '@/src/presentation/components/shared/Footer'
import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'

/**
 * 마케팅 및 공개 페이지용 레이아웃 (Landing, Pricing, Payment Success)
 * 기존 전역 NavBar와 Footer를 포함합니다.
 */
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar userId={user?.id} />
      <main className="flex-1 pt-[72px]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
