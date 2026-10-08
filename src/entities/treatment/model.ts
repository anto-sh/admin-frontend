import { treatmentApi } from './api'
import type { UpdateTreatmentBatchDto } from './types'
import { createCrudComposable } from '@/shared/lib/crud'

const useTreatmentBaseModel = createCrudComposable(treatmentApi)

export const useTreatmentModel = () => {
  const treatmentBase = useTreatmentBaseModel()

  async function updateBatch(dtoArr: UpdateTreatmentBatchDto[]) {
    treatmentBase.pendingRequestCounter.start()
    try {
      await treatmentApi.updateBatch(dtoArr, treatmentBase.abortSignal)
    } finally {
      treatmentBase.pendingRequestCounter.finish()
    }
  }

  return { ...treatmentBase, updateBatch }
}
