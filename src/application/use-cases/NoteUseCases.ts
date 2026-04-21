import { NoteRepository } from '@/src/application/ports/out/NoteRepository'
import { UserRepository } from '@/src/application/ports/out/UserRepository'
import { Note, NoteProps } from '@/src/domain/entities/Note'
import { SubscriptionRequiredError } from '@/src/domain/errors/SubscriptionRequiredError'

export class NoteUseCases {
  constructor(
    private noteRepository: NoteRepository,
    private userRepository: UserRepository
  ) {}

  async getUserNotes(userId: string): Promise<Note[]> {
    return this.noteRepository.findAllByUserId(userId)
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.noteRepository.findById(id)
  }

  async createNote(props: NoteProps): Promise<Note> {
    const { userId } = props
    
    // 권한 체크
    const subscription = await this.userRepository.getUserSubscription(userId)
    const plan = subscription?.plan || 'free'
    
    if (plan === 'free') {
      const currentNoteCount = await this.noteRepository.countByUserId(userId)
      const LIMIT = 10
      if (currentNoteCount >= LIMIT) {
        throw new SubscriptionRequiredError(`무료 플랜은 최대 ${LIMIT}개의 노트까지만 생성할 수 있습니다.`)
      }
    }

    const note = new Note(props)
    return this.noteRepository.save(note)
  }

  async updateNote(props: NoteProps): Promise<Note> {
    if (!props.id) throw new Error('Note ID is required for update')
    
    // 권한 체크 (Defense in Depth)
    const existingNote = await this.noteRepository.findById(props.id)
    if (!existingNote) {
      throw new Error('노트를 찾을 수 없습니다.')
    }
    
    if (existingNote.userId !== props.userId) {
      throw new Error('이 노트를 수정할 권한이 없습니다.')
    }
    
    const note = new Note(props)
    return this.noteRepository.save(note)
  }

  async deleteNote(id: string, userId: string): Promise<void> {
    const existingNote = await this.noteRepository.findById(id)
    if (!existingNote) {
      throw new Error('노트를 찾을 수 없습니다.')
    }
    
    if (existingNote.userId !== userId) {
      throw new Error('이 노트를 삭제할 권한이 없습니다.')
    }

    return this.noteRepository.delete(id)
  }
}
