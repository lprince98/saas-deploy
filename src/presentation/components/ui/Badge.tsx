import React from 'react'
import { cn } from '@/src/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'outline' | 'dark' | 'locked' | 'error'
  children: React.ReactNode
}

export function Badge({ children, variant = 'info', className, ...props }: BadgeProps) {
  const variants = {
    info: 'bg-[#cde6f4] text-[#506873]',
    success: 'bg-[#e7f3e5] text-[#426a3c]',
    outline: 'border border-slate-300 text-slate-500',
    dark: 'bg-[#191c1e] text-white',
    locked: 'bg-slate-100 text-slate-400 opacity-50 flex items-center gap-1',
    error: 'bg-red-50 text-[#ba1a1a] border border-red-100'
  }

  return (
    <div 
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center',
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === 'locked' && (
        <span className="material-symbols-outlined text-[14px]">lock</span>
      )}
      {children}
    </div>
  )
}
