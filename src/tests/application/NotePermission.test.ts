import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { NoteRepository } from '@/src/application/ports/out/NoteRepository'
import { UserRepository } from '@/src/application/ports/out/UserRepository'
import { SubscriptionRequiredError } from '@/src/domain/errors/SubscriptionRequiredError'

describe('NoteUseCases - Permission Control', () => {
  let noteUseCases: NoteUseCases
  let mockNoteRepo: NoteRepository
  let mockUserRepo: UserRepository

  beforeEach(() => {
    mockNoteRepo = {
      findAllByUserId: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      countByUserId: vi.fn(), // 새로 추가될 메서드
    } as any

    mockUserRepo = {
      getUserSubscription: vi.fn(),
    }

    noteUseCases = new NoteUseCases(mockNoteRepo, mockUserRepo)
  })

  it('free 플랜 사용자가 노트를 10개 미만으로 가진 경우 생성이 가능해야 한다', async () => {
    const userId = 'user-123'
    vi.mocked(mockUserRepo.getUserSubscription).mockResolvedValue({
      userId,
      plan: 'free',
      status: 'active',
    })
    vi.mocked(mockNoteRepo.countByUserId).mockResolvedValue(5)
    vi.mocked(mockNoteRepo.save).mockResolvedValue({ id: 'new-note' } as any)

    const result = await noteUseCases.createNote({
      ownerId: userId,
      title: 'Valid Note',
      note_type: 'article',
      access: 'private',
    })

    expect(result).toBeDefined()
    expect(mockNoteRepo.save).toHaveBeenCalled()
  })

  it('free 플랜 사용자가 이미 10개의 노트를 가진 경우 생성이 차단되어야 한다', async () => {
    const userId = 'user-123'
    vi.mocked(mockUserRepo.getUserSubscription).mockResolvedValue({
      userId,
      plan: 'free',
      status: 'active',
    })
    vi.mocked(mockNoteRepo.countByUserId).mockResolvedValue(10)

    await expect(noteUseCases.createNote({
      ownerId: userId,
      title: 'Forbidden Note',
      note_type: 'article',
      access: 'private',
    })).rejects.toThrow(SubscriptionRequiredError)
    
    expect(mockNoteRepo.save).not.toHaveBeenCalled()
  })

  it('pro 플랜 사용자는 10개 이상의 노트를 가지고 있어도 생성이 가능해야 한다', async () => {
    const userId = 'user-pro'
    vi.mocked(mockUserRepo.getUserSubscription).mockResolvedValue({
      userId,
      plan: 'pro',
      status: 'active',
    })
    vi.mocked(mockNoteRepo.countByUserId).mockResolvedValue(15)
    vi.mocked(mockNoteRepo.save).mockResolvedValue({ id: 'pro-note' } as any)

    const result = await noteUseCases.createNote({
      ownerId: userId,
      title: 'Pro Note',
      note_type: 'article',
      access: 'private',
    })

    expect(result).toBeDefined()
    expect(mockNoteRepo.save).toHaveBeenCalled()
  })
})
