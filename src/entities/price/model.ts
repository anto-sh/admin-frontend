import { priceApi } from './api'
import type { UpdatePriceBatchDto } from './types'
import { createCrudComposable } from '@/shared/lib/crud/createCrudComposable'

const usePriceBaseModel = createCrudComposable(priceApi)

export const usePriceModel = () => {
  const priceBase = usePriceBaseModel()

  async function updateBatch(dtoArr: UpdatePriceBatchDto[]) {
    priceBase.pendingRequestCounter.start()
    try {
      await priceApi.updateBatch(dtoArr, priceBase.abortSignal)
    } finally {
      priceBase.pendingRequestCounter.finish()
    }
  }

  return { ...priceBase, updateBatch }
}
