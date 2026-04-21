import { Note } from '@/src/domain/entities/Note'

export interface NoteRepository {
  findAllByUserId(userId: string): Promise<Note[]>
  findById(id: string): Promise<Note | null>
  save(note: Note): Promise<Note>
  delete(id: string): Promise<void>
  countByUserId(userId: string): Promise<number>
}
