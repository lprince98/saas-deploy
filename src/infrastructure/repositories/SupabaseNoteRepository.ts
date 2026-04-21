import { NoteRepository } from '@/src/application/ports/out/NoteRepository'
import { Note } from '@/src/domain/entities/Note'
import { SupabaseClient } from '@supabase/supabase-js'

export class SupabaseNoteRepository implements NoteRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapToDomain(data: any): Note {
    return new Note({
      id: data.id,
      userId: data.user_id || data.owner_id,
      title: data.title,
      content: data.content,
      // Domain fields that are missing in DB table default to undefined or false
      category: undefined, 
      tags: [], 
      isPinned: false, 
      isFavorite: data.is_favorited || data.is_favorite || false,
      isShared: data.access === 'shared' || data.is_shared || false,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    })
  }

  private mapToDb(note: Note) {
    const dbData: any = {
      owner_id: note.userId, // use owner_id instead of user_id
      title: note.title,
      content: note.content,
      is_favorited: note.isFavorite,
      access: note.isShared ? 'shared' : 'private',
    }
    
    if (note.id) {
       dbData.id = note.id
    }
    
    return dbData
  }

  async findAllByUserId(userId: string): Promise<Note[]> {
    try {
      const { data, error } = await this.supabase
        .from('notes')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      return (data || []).map(this.mapToDomain)
    } catch (e) {
      console.error('Notes fetch failed:', e)
      return []
    }
  }

  async findById(id: string): Promise<Note | null> {
    try {
      const { data, error } = await this.supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return null
      }
      return this.mapToDomain(data)
    } catch (e) {
      return null
    }
  }

  async save(note: Note): Promise<Note> {
    const dbData = this.mapToDb(note)
    
    // Try full save
    const { data, error } = await this.supabase
      .from('notes')
      .upsert(dbData)
      .select()
      .single()

    if (error) {
        // Log explicitly if necessary
        console.error("SupabaseNoteRepository upsert error:", error)
        throw error
    }
    return this.mapToDomain(data)
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('notes').delete().eq('id', id)
    if (error) throw error
  }

  async countByUserId(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)
    
    if (error) throw error
    return count || 0
  }
}
