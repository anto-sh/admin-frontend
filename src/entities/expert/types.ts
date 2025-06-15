import type { OutputData } from '@editorjs/editorjs'

// Специалист

export interface ExpertDto {
  id: number
  fullName: string
  description: string
  imageUrl: string
  categoryId: number
  contentJson?: OutputData
}

export interface CreateExpertDto {
  fullName?: string
  description?: string
  imageUrl?: string
  categoryId?: number
  contentJson?: OutputData
}

export interface UpdateExpertDto {
  fullName?: string
  description?: string
  imageUrl?: string
  categoryId?: number
  contentJson?: OutputData
}
