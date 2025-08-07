export interface GeneratedContent {
  hooks: string[]
  titles: string[]
  hashtags: string[]
  ctas: string[]
  platform?: string
}

export interface SavedContent {
  id: string
  topic: string
  tone: string
  hook: string
  title: string
  hashtags: string[]
  cta: string
  timestamp: number
  hookScore?: 'Low' | 'Medium' | 'Viral'
  isPinned?: boolean
  customTags?: string[]
  notes?: string
} 