import React from 'react'
import { Container } from '@/src/presentation/components/ui/Container'

/**
 * 대시보드 로딩 스켈레톤 (Bento Layout)
 */
export default function AppLoading() {
  return (
    <Container className="py-12 space-y-12">
      {/* Welcome Skeleton */}
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-48 bg-slate-200 rounded-lg"></div>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-12 w-96 bg-slate-300 rounded-xl"></div>
            <div className="h-6 w-64 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-12 w-32 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-12 gap-6 h-[400px]">
        <div className="col-span-12 lg:col-span-7 bg-slate-100/50 border border-slate-200 rounded-3xl animate-pulse flex flex-col p-8">
           <div className="h-6 w-24 bg-slate-300 rounded-full mb-6"></div>
           <div className="h-10 w-3/4 bg-slate-300 rounded-xl mb-4"></div>
           <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-5 bg-slate-100/50 border border-slate-200 rounded-3xl animate-pulse p-8">
           <div className="h-6 w-24 bg-slate-300 rounded-full mb-6"></div>
           <div className="h-8 w-1/2 bg-slate-300 rounded-xl mb-4"></div>
           <div className="h-32 w-full bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      {/* List Skeleton */}
      <div className="space-y-8">
         <div className="h-8 w-48 bg-slate-300 rounded-lg animate-pulse"></div>
         <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center p-6 animate-pulse">
                <div className="h-12 w-12 bg-slate-200 rounded-xl mr-6"></div>
                <div className="flex-1 space-y-2">
                   <div className="h-5 w-1/3 bg-slate-300 rounded"></div>
                   <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-24 bg-slate-200 rounded px-4"></div>
              </div>
            ))}
         </div>
      </div>
    </Container>
  )
}
