import React from 'react'
import { cn } from '@/src/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-headline font-bold rounded-lg transition-all active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-gradient-to-br from-[#24389c] to-[#3f51b5] text-white shadow-xl shadow-indigo-500/10 hover:opacity-95',
    secondary: 'bg-[#cde6f4] text-[#506873] hover:bg-opacity-80',
    ghost: 'bg-[#e6e8eb] text-[#191c1e] hover:bg-slate-300',
    outline: 'bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-50',
    dark: 'bg-[#191c1e] text-white hover:bg-black'
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
