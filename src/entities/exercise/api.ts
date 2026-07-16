import type { CreateExerciseDto, ExerciseDto, UpdateExerciseDto } from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const exerciseApi = createCrudApi<ExerciseDto, CreateExerciseDto, UpdateExerciseDto>({
  type: 'entity',
  url: '/exercises',
})
