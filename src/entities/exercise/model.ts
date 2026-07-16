import { exerciseApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

export const useExerciseModel = createCrudComposable(exerciseApi)
