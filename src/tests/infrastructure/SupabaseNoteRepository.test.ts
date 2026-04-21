import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseNoteRepository } from '@/src/infrastructure/repositories/SupabaseNoteRepository'

describe('SupabaseNoteRepository', () => {
  let repository: SupabaseNoteRepository
  let mockSupabase: any

  beforeEach(() => {
    // Fluent interface mocking
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    }
    repository = new SupabaseNoteRepository(mockSupabase)
  })

  it('should fetch notes from supabase', async () => {
    const mockData = [{ id: '1', user_id: 'u1', title: 'Test', content: {} }]
    // Set final promise value
    mockSupabase.order.mockResolvedValue({
      data: mockData,
      error: null,
    })

    const result = await repository.findAllByUserId('u1')

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test')
    expect(mockSupabase.from).toHaveBeenCalledWith('notes')
  })
})
