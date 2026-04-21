'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { SidebarItem } from '@/src/presentation/components/ui/SidebarItem'
import { Button } from '@/src/presentation/components/ui/Button'
import { createNoteAction } from '@/src/application/actions/noteActions'
import { promoteUserToProAction } from '@/src/application/actions/promoteUserAction'

/**
 * 전역 사이드바 컴포넌트 프로퍼티
 */
interface SideNavBarProps {
  userName?: string
  plan?: string
}

/**
 * 전역 사이드바 컴포넌트
 * 대시보드와 노트 에디터에서 워크스페이스 내비게이션을 위해 사용됩니다.
 */
export function SideNavBar({ userName, plan }: SideNavBarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: '모든 노트', icon: 'description', href: '/dashboard' },
    { name: '즐겨찾기', icon: 'star', href: '#' },
    { name: '노트북', icon: 'folder', href: '#' },
    { name: '공유됨', icon: 'group', href: '#' },
    { name: '휴지통', icon: 'delete', href: '#' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-100 dark:bg-slate-900 flex flex-col p-4 space-y-2 z-40 border-r border-slate-200 dark:border-slate-800">
      <div className="mb-8 px-4 py-4 flex flex-col">
        <span className="text-xl font-bold text-indigo-950 dark:text-indigo-100 font-headline">
          나의 갤러리
        </span>
        <span className="text-xs text-secondary opacity-70">
          개인 작업 공간
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            href={item.href}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      <form action={createNoteAction}>
        <Button 
          type="submit"
          className="w-full mt-auto mb-6 bg-gradient-to-br from-[#24389c] to-[#3f51b5] text-white py-6 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm">새 노트</span>
        </Button>
      </form>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-1">
        <SidebarItem name="설정" icon="settings" href="#" className="py-2" />
        <SidebarItem name="도움말" icon="help" href="#" className="py-2" />
      </div>

      <div className="flex items-center gap-3 px-4 mt-6 pt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 relative">
          <Image
            src="/auth-preview-gallery.png"
            alt="프로필"
            fill
            className="object-cover grayscale opacity-80"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#191c1e] dark:text-white font-headline">
            {userName || '알렉스 큐레이터'}
          </span>
          <span className="text-[10px] text-secondary opacity-80 uppercase tracking-tighter font-bold">
            {plan === 'pro' ? '프로 큐레이터' : '프리 가입자'}
          </span>
        </div>
      </div>
    </aside>
  )
}
