import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NoteUseCases } from '@/src/application/use-cases/NoteUseCases'
import { NoteRepository } from '@/src/application/ports/out/NoteRepository'
import { Note } from '@/src/domain/entities/Note'

describe('NoteUseCases', () => {
  let noteUseCases: NoteUseCases
  let mockRepo: NoteRepository

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    }
    noteUseCases = new NoteUseCases(mockRepo)
  })

  it('should get notes for a user', async () => {
    const mockNotes = [
      new Note({ userId: 'u1', title: 'N1', content: {} }),
      new Note({ userId: 'u1', title: 'N2', content: {} }),
    ]
    vi.mocked(mockRepo.findAllByUserId).mockResolvedValue(mockNotes)

    const result = await noteUseCases.getUserNotes('u1')

    expect(result).toHaveLength(2)
    expect(mockRepo.findAllByUserId).toHaveBeenCalledWith('u1')
  })

  it('should create a new note', async () => {
    const noteData = { userId: 'u1', title: 'New Note', content: {} }
    vi.mocked(mockRepo.save).mockImplementation(async (note) => note)

    const result = await noteUseCases.createNote(noteData)

    expect(result.title).toBe('New Note')
    expect(mockRepo.save).toHaveBeenCalled()
  })
})
