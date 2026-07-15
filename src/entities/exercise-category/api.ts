import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
  UpdateExerciseCategoryDto,
} from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const exerciseCategoryApi = createCrudApi<
  ExerciseCategoryDto,
  CreateExerciseCategoryDto,
  UpdateExerciseCategoryDto
>({ type: 'category', url: '/exercise-categories' })
