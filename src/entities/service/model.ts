import { serviceApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

export const useServiceModel = createCrudComposable(serviceApi)
