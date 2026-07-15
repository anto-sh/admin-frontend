import type { CreateExpertDto, ExpertDto, UpdateExpertDto } from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const expertApi = createCrudApi<ExpertDto, CreateExpertDto, UpdateExpertDto>({
  type: 'entity',
  url: '/experts',
})
