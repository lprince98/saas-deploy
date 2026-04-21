import { describe, it, expect } from 'vitest'
import { Note } from '@/src/domain/entities/Note'

describe('Note Entity', () => {
  it('should create a valid note instance', () => {
    const noteData = {
      id: '123',
      userId: 'user-456',
      title: 'My First Note',
      content: { text: 'Hello' },
      category: 'Work',
      isPinned: false,
      isFavorite: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const note = new Note(noteData)

    expect(note.id).toBe('123')
    expect(note.title).toBe('My First Note')
    expect(note.isFavorite).toBe(true)
  })

  it('should throw error if title is empty', () => {
    const invalidData = {
      id: '123',
      userId: 'user-456',
      title: '',
      content: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(() => new Note(invalidData)).toThrow('Title is required')
  })
})
