import React from 'react'
import { cn } from '@/src/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string | React.ReactNode
  rightElement?: React.ReactNode
}

/**
 * The Digital Curator 표준 입력 컴포넌트
 */
export function Input({
  className,
  icon,
  rightElement,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="relative group/input w-full">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] group-focus-within/input:text-[#24389c] transition-colors pointer-events-none">
          {typeof icon === 'string' ? (
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          ) : (
            icon
          )}
        </span>
      )}
      <input
        type={type}
        className={cn(
          "w-full py-3 bg-[#f2f4f7] border-0 rounded-lg text-sm transition-all outline-none font-inter",
          "focus:ring-2 focus:ring-[#24389c]/20 focus:bg-[#f7f9fc] placeholder:text-[#757684]/50 text-[#191c1e]",
          icon ? "pl-10" : "pl-4",
          rightElement ? "pr-12" : "pr-4",
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  )
}
