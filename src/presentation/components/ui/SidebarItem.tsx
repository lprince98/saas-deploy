import React from 'react'
import Link from 'next/link'
import { cn } from '@/src/lib/utils'

interface SidebarItemProps {
  name: string
  icon: string
  href: string
  active?: boolean
  className?: string
}

/**
 * SideNavBar 전용 내비게이션 아이템 컴포넌트
 */
export function SidebarItem({ name, icon, href, active, className }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group font-manrope",
        active
          ? "bg-white text-[#24389c] shadow-sm"
          : "text-[#4a626d] hover:bg-slate-200/50 hover:text-[#24389c] hover:translate-x-1",
        className
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined text-[20px]",
          active ? "text-[#24389c]" : "text-slate-400 group-hover:text-[#24389c]"
        )}
      >
        {icon}
      </span>
      {name}
    </Link>
  )
}
