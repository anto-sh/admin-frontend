import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
  UpdateServiceCategoryDto,
} from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const serviceCategoryApi = createCrudApi<
  ServiceCategoryDto,
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto
>({ type: 'category', url: 'service-categories' })
