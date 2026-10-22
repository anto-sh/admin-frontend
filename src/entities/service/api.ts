import type { CreateServiceDto, Service, UpdateServiceDto } from './types'
import { createCrudApi } from '@/shared/lib/crud'

export const serviceApi = createCrudApi<Service, CreateServiceDto, UpdateServiceDto, Service>({
  type: 'entity',
  url: '/services',
})
