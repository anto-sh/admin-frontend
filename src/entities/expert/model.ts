import { expertApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

export const useExpertModel = createCrudComposable(expertApi)
