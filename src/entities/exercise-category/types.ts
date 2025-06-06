import type { ExerciseDto } from '../exercise/types'

export interface ExerciseCategoryDto {
  id: number
  name?: string
  url?: string
  exercises?: ExerciseDto[]
}

export interface CreateExerciseCategoryDto {
  name?: string
  url?: string
}

export interface UpdateExerciseCategoryDto {
  name?: string
  url?: string
}
