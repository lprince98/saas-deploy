import React from 'react'
import { cn } from '@/src/lib/utils'

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  decorator?: boolean
}

export function SectionHeader({ 
  title, 
  subtitle, 
  align = 'center', 
  decorator = false, 
  className, 
  ...props 
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        'mb-16 space-y-4',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      {...props}
    >
      <h2 className={cn(
        'text-4xl font-headline font-bold tracking-tight text-[#191c1e]',
        align === 'center' ? 'mx-auto' : ''
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'text-[#4a626d] max-w-2xl',
          align === 'center' ? 'mx-auto' : ''
        )}>
          {subtitle}
        </p>
      )}
      {decorator && align === 'center' && (
        <div className="w-12 h-1 bg-[#24389c] mx-auto rounded-full mt-6"></div>
      )}
    </div>
  )
}
