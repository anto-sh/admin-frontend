import { serviceCategoryApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

export const useServiceCategoryModel = createCrudComposable(serviceCategoryApi)
