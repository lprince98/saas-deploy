import React from 'react'
import { cn } from '@/src/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bento' | 'accent' | 'glass'
  hover?: boolean
}

export function Card({ 
  children, 
  variant = 'default', 
  hover = false, 
  className, 
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-300'
  
  const variants = {
    default: 'bg-white border-slate-200/50 shadow-sm',
    bento: 'bg-white border-slate-200/30 shadow-md',
    accent: 'bg-gradient-to-br from-[#24389c] to-[#3f51b5] text-white border-transparent shadow-2xl',
    glass: 'bg-white/80 backdrop-blur-xl border-white/20 shadow-xl'
  }

  const hoverStyles = hover ? 'hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-900/5 cursor-pointer' : ''

  return (
    <div 
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
