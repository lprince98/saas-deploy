'use client'

import React from 'react'
import { Container } from '@/src/presentation/components/ui/Container'
import { Input } from '@/src/presentation/components/ui/Input'

export function DashboardHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
      <Container className="h-16 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <Input 
            placeholder="아카이브 검색..." 
            icon="search"
            className="rounded-full bg-slate-100 focus:bg-white border-transparent"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <span className="text-sm font-bold text-indigo-950 font-headline hidden sm:block uppercase tracking-wider">
            나만의 갤러리
          </span>
        </div>
      </Container>
    </header>
  )
}
