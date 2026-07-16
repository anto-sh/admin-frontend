import { treatmentApi } from './api'
import type { UpdateTreatmentBatchDto } from './types'
import { createCrudComposable } from '@/shared/lib/crud'

const useTreatmentBaseModel = createCrudComposable(treatmentApi)

export const useTreatmentModel = () => {
  const treatmentBase = useTreatmentBaseModel()

  async function updateBatch(dtoArr: UpdateTreatmentBatchDto[]) {
    treatmentBase.isLoading.value = true
    try {
      await treatmentApi.updateBatch(dtoArr)
    } finally {
      treatmentBase.isLoading.value = false
    }
  }

  return { ...treatmentBase, updateBatch }
}
