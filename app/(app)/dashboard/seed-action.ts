'use server'

import { createSupabaseServerClient } from '@/src/infrastructure/database/supabase-server'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'
import { SupabaseUserRepository } from '@/src/infrastructure/repositories/SupabaseUserRepository'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { redirect } from 'next/navigation'

/**
 * 테스트용 노트를 생성하고 대시보드로 이동시키는 액션
 */
export async function seedNotesAction() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const noteRepo = new SupabaseNoteRepository(supabase)
  const userRepo = new SupabaseUserRepository()
  const noteUseCases = new NoteUseCases(noteRepo, userRepo)

  // Seed data (10 notes to hit the limit)
  for (let i = 1; i <= 10; i++) {
    await noteUseCases.createNote({
      userId: user.id,
      title: `샘플 큐레이션 노트 #${i}`,
      content: `${i}번째 샘플 데이터입니다. 에디토리얼 디자인과 지식 관리를 위한 테스트용 본문입니다.`,
      category: i % 2 === 0 ? '디자인 철학' : '기술 통찰',
      isPinned: i <= 2
    })
  }

  redirect('/dashboard')
}
