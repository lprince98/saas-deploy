import React from 'react'
import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { NoteEditorClient } from '@/src/presentation/components/editor/NoteEditorClient'
import { notFound } from 'next/navigation'

interface NotePageProps {
  params: Promise<{ id: string }>
}

/**
 * 프로젝트 개별 노트 서버 컴포넌트
 * 노트를 조회하여 클라이언트 에디터에 전달합니다.
 */
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const noteRepo = new SupabaseNoteRepository(supabase)
  const userRepo = new SupabaseUserRepository()
  const noteUseCases = new NoteUseCases(noteRepo, userRepo)

  const note = await noteUseCases.getNoteById(id)

  if (!note) {
    notFound()
  }

  // Domain객체를 Plain JSON으로 변환하여 Client Component에 전달
  const plainNote = {
    id: note.id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    isPinned: note.isPinned,
    isFavorite: note.isFavorite,
    updatedAt: note.updatedAt?.toISOString(),
  }

  return <NoteEditorClient noteId={id} initialNote={plainNote} />
}
