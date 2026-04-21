import React from 'react'
import { cn } from '@/src/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

/**
 * The Digital Curator 표준 라벨 컴포넌트
 */
export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-bold text-[#454652] uppercase tracking-wider px-1 font-manrope",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
