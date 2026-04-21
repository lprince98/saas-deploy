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
    
    // 수정 시에는 별도의 개수 제한을 두지 않으나 
    // 추후 필요 시 여기에 로직 추가 가능
    
    const note = new Note(props)
    return this.noteRepository.save(note)
  }

  async deleteNote(id: string): Promise<void> {
    return this.noteRepository.delete(id)
  }
}
