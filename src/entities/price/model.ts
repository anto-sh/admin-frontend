import { priceApi } from './api'
import type { UpdatePriceBatchDto } from './types'
import { createCrudComposable } from '@/shared/lib/crud/createCrudComposable'

const usePriceBaseModel = createCrudComposable(priceApi)

export const usePriceModel = () => {
  const priceBase = usePriceBaseModel()

  async function updateBatch(dtoArr: UpdatePriceBatchDto[]) {
    priceBase.isLoading.value = true
    try {
      await priceApi.updateBatch(dtoArr)
      await priceBase.fetchAll()
    } finally {
      priceBase.isLoading.value = false
    }
  }

  return { ...priceBase, updateBatch }
}
