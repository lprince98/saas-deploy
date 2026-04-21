import React from 'react'
import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { NoteEditorClient } from '@/src/presentation/components/editor/NoteEditorClient'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface NotePageProps {
  params: Promise<{ id: string }>
}

/**
 * 개별 노트의 메타데이터를 동적으로 생성합니다. (SNS 공유 최적화)
 */
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const noteRepo = new SupabaseNoteRepository(supabase)
  const userRepo = new SupabaseUserRepository()
  const noteUseCases = new NoteUseCases(noteRepo, userRepo)

  const note = await noteUseCases.getNoteById(id)

  if (!note) {
    return {
      title: '노트를 찾을 수 없습니다 — CloudNote',
    }
  }

  return {
    title: `${note.title} — CloudNote`,
    description: typeof note.content === 'string' ? note.content.slice(0, 160) : '나의 사유를 확인해 보세요.',
    openGraph: {
      title: `${note.title} — CloudNote`,
      description: 'The Digital Curator에서 큐레이션된 생각',
      type: 'article',
    },
  }
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
