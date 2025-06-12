import type { OutputData } from '@editorjs/editorjs'

// Упражнение

export interface ExerciseDto {
  id: number
  name: string
  categoryId: number
  contentJson?: OutputData
}

export interface CreateExerciseDto {
  name?: string
  categoryId?: number
  contentJson?: OutputData
}

export interface UpdateExerciseDto {
  name?: string
  categoryId?: number
  contentJson?: OutputData
}
