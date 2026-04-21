import React from 'react'
import { cn } from '@/src/lib/utils'

interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'pill'
  size?: 'sm' | 'md' | 'lg'
}

export function IconBox({ 
  icon, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: IconBoxProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-300'
  
  const variants = {
    primary: 'bg-[#f2f4f7] text-[#24389c]',
    secondary: 'bg-[#cde6f4] text-[#506873]',
    ghost: 'bg-[#e6e8eb] text-slate-500',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
    pill: 'bg-white/20 backdrop-blur-sm text-inherit rounded-full'
  }

  const sizes = {
    sm: 'w-8 h-8 text-[18px]',
    md: 'w-12 h-12 text-[24px]',
    lg: 'w-16 h-16 text-[32px]'
  }

  return (
    <div 
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  )
}
