'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { logoutAction } from '@/src/application/actions/logoutAction'

interface TopNavBarProps {
  userId?: string
}

/**
 * 전역 상단 내비게이션 바
 * 페이지 경로에 따라 마케팅용 혹은 대시보드용으로 실시간 전환됩니다.
 */
export function TopNavBar({ userId }: TopNavBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const isAppPage = pathname.startsWith('/dashboard') || pathname.startsWith('/notes')
  const mlClass = isAppPage ? 'pl-64' : 'px-8'

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center ${mlClass} py-4 max-w-full border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300`}>
      <div className="flex items-center gap-8 flex-1">
        {!isAppPage ? (
          <>
            <Link href="/" className="text-xl font-bold tracking-tighter text-indigo-900 dark:text-indigo-100 font-headline">
              The Digital Curator
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link href="/pricing" className="font-manrope tracking-tight font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-300">
                요금제
              </Link>
              <Link href="#" className="font-manrope tracking-tight font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-300">
                솔루션
              </Link>
              <Link href="#" className="font-manrope tracking-tight font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-300">
                리소스
              </Link>
            </div>
          </>
        ) : (
          <div className="flex-1 max-w-2xl flex items-center gap-4 px-4 overflow-hidden">
             <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#24389c] transition-colors">
                search
              </span>
              <input
                type="text"
                placeholder="아카이브 검색..."
                className="w-full bg-[#f2f4f7] dark:bg-slate-900 border-none rounded-full pl-12 pr-4 py-2.5 text-[#191c1e] dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 px-8">
        {!isAppPage ? (
          <>
            {userId ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button className="bg-[#24389c] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-manrope tracking-tight font-semibold transition-all duration-300 scale-95 active:scale-100 shadow-md shadow-indigo-500/20">
                    대시보드로 이동
                  </button>
                </Link>
                <button 
                  onClick={() => logoutAction()}
                  className="font-manrope tracking-tight font-semibold text-slate-500 hover:text-red-500 transition-all duration-300 text-sm"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/login')}
                  className="font-manrope tracking-tight font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all duration-300 scale-95 active:scale-100"
                >
                  로그인
                </button>
                <button 
                  onClick={() => router.push('/signup')}
                  className="bg-[#24389c] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-manrope tracking-tight font-semibold transition-all duration-300 scale-95 active:scale-100 shadow-md shadow-indigo-500/20"
                >
                  시작하기
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-[#24389c] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <h1 className="hidden sm:block font-headline font-extrabold text-xl tracking-tighter text-indigo-900 dark:text-indigo-200">
              The Digital Curator
            </h1>
            <button 
              onClick={() => logoutAction()}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
              title="로그아웃"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
