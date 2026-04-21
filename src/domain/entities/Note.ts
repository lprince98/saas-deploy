export interface NoteProps {
  id?: string
  userId: string
  title: string
  content: any
  category?: string
  tags?: string[]
  isPinned?: boolean
  isFavorite?: boolean
  isShared?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class Note {
  readonly id?: string
  readonly userId: string
  readonly title: string
  readonly content: any
  readonly category?: string
  readonly tags: string[]
  readonly isPinned: boolean
  readonly isFavorite: boolean
  readonly isShared: boolean
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor(props: NoteProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Title is required')
    }

    this.id = props.id
    this.userId = props.userId
    this.title = props.title
    this.content = props.content
    this.category = props.category
    this.tags = props.tags || []
    this.isPinned = props.isPinned || false
    this.isFavorite = props.isFavorite || false
    this.isShared = props.isShared || false
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
