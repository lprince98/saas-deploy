'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SideNavBar } from '@/src/presentation/components/shared/SideNavBar'
import { Editor } from '@/src/presentation/components/editor/Editor'
import { createSupabaseBrowserClient } from '@/src/infrastructure/database/supabase-browser'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { Badge } from '@/src/presentation/components/ui/Badge'
import { Button } from '@/src/presentation/components/ui/Button'
import { IconBox } from '@/src/presentation/components/ui/IconBox'

interface NoteEditorClientProps {
  noteId: string
  initialNote: any
}

/**
 * 노트 에디터 클라이언트 컴포넌트
 */
export function NoteEditorClient({ noteId, initialNote }: NoteEditorClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialNote?.title || '')
  const [content, setContent] = useState(initialNote?.content || {})
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(initialNote?.updatedAt ? new Date(initialNote.updatedAt) : null)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const noteRepo = new SupabaseNoteRepository(supabase)
      const noteUseCases = new NoteUseCases(noteRepo)

      await noteUseCases.updateNote({
        id: noteId,
        userId: initialNote.userId,
        title,
        content,
        isPinned: initialNote.isPinned,
        isFavorite: initialNote.isFavorite,
      })
      
      setLastSaved(new Date())
    } catch (error) {
       console.error('Failed to save note:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Editor Area */}
      <main className="flex-1 overflow-y-auto px-12 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-[3.5rem] font-headline font-extrabold text-indigo-950 placeholder-slate-200 outline-none tracking-tight"
            placeholder="제목 없는 노트"
          />

          <Editor initialContent={content} onUpdate={setContent} />
        </div>
      </main>

      {/* Inspector Sidebar */}
      <aside className="w-80 bg-[#f2f4f7] p-8 border-l border-slate-200/50 flex flex-col gap-8 overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-headline">메타데이터</h3>
          <div className="space-y-4 font-manrope">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#4a626d]">상태</span>
              <span className={`font-medium ${isSaving ? 'text-[#24389c]' : 'text-slate-400'}`}>
                 {isSaving ? '저장 중...' : '저장됨'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#4a626d]">최근 수정</span>
              <span className="font-medium text-[#191c1e]">
                 {lastSaved ? lastSaved.toLocaleTimeString() : '기록 없음'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-headline">분류</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">디자인 이론</Badge>
            <Button variant="ghost" size="sm" className="px-3 py-1 border border-slate-300 text-slate-500 rounded-full bg-transparent hover:bg-white text-xs">
              + 태그 추가
            </Button>
          </div>
        </div>

        <div className="mt-auto space-y-3">
           <Button 
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="w-full bg-white text-slate-600 border-slate-200"
           >
              닫기
           </Button>
           <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
           >
              {isSaving ? '저장 중...' : '저장하기'}
           </Button>
        </div>
      </aside>

      {/* Focus Mode Trigger */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-[#191c1e] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          <IconBox icon="fullscreen" className="bg-transparent text-white" />
        </button>
      </div>
    </div>
  )
}
