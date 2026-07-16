import type { CreateServiceDto, ServiceDto, UpdateServiceDto } from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const serviceApi = createCrudApi<ServiceDto, CreateServiceDto, UpdateServiceDto>({
  type: 'entity',
  url: '/services',
})
