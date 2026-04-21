import React from 'react'
import { cn } from '@/src/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

/**
 * 일관된 최대 너비와 패딩을 제공하는 컨테이너 컴포넌트
 */
export function Container({ 
  children, 
  className, 
  as: Component = 'div' 
}: ContainerProps) {
  return (
    <Component className={cn("max-w-7xl mx-auto px-6 w-full", className)}>
      {children}
    </Component>
  )
}
