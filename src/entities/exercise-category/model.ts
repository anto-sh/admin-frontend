import { exerciseCategoryApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

export const useExerciseCategoryModel = createCrudComposable(exerciseCategoryApi)
