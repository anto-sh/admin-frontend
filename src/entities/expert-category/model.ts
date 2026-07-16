import { expertCategoryApi } from './api'
import { createCrudComposable } from '@/shared/lib/crud'

const useBaseExpertModel = createCrudComposable(expertCategoryApi)

export const useExpertCategoryModel = () => {
  const { categories, isLoading, fetchAll, fetchAllWithEntities } = useBaseExpertModel()
  return { categories, isLoading, fetchAll, fetchAllWithEntities }
}
