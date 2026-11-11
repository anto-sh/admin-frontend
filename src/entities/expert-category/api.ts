import { createCrudApi } from '@/shared/lib/crud'
import type { ExpertCategoryDto } from './types'

// TODO: тут возможность нарушить контракт - можно обратиться к эндпоинтам, которых нет
// надо бы подумать, что с этим можно сделать и нужно ли что-то делать
// так-то мы в итоге ограничиваем в model доступные методы
export const expertCategoryApi = createCrudApi<ExpertCategoryDto, unknown, unknown>({
  type: 'category',
  url: '/expert-categories',
})
