'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { redirect } from 'next/navigation'

/**
 * 새로운 노트를 생성하고 에디터 페이지로 이동시키는 Server Action
 */
export async function createNoteAction() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const noteRepo = new SupabaseNoteRepository(supabase)
  const userRepo = new SupabaseUserRepository()
  const noteUseCases = new NoteUseCases(noteRepo, userRepo)

  try {
    const newNote = await noteUseCases.createNote({
      userId: user.id,
      title: '제목 없는 노트',
      content: '', // 초기 빈 내용
      category: '일반',
    })

    if (newNote && newNote.id) {
      redirect(`/notes/${newNote.id}`)
    }
  } catch (error: any) {
    console.error('SERVER ACTION ERROR DETAIL:', JSON.stringify(error, null, 2))
    
    if (error.name === 'SubscriptionRequiredError' || error.message?.includes('SubscriptionRequiredError')) {
      // 10개 한도 초과 시 요금제 페이지로 유도
      redirect('/pricing')
    }
    
    // 로깅 후 구체적 에러 메시지를 프론트엔드로 던지기 위해
    throw new Error(error.message || JSON.stringify(error) || '알 수 없는 서버 오류가 발생했습니다.');
  }
}

