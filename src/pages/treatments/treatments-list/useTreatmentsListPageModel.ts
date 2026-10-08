import { useTreatmentModel } from '@/entities/treatment/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type { TreatmentDto, UpdateTreatmentDto } from '@/entities/treatment/types'

export function useTreatmentsListPageModel() {
  const treatmentModel = useTreatmentModel()
  const newTreatmentName = ref('')

  const treatmentEntities = ref<TreatmentDto[]>([])

  onMounted(() => {
    treatmentModel.fetchAll()
  })

  watch(
    treatmentModel.entities,
    (newVal) => (treatmentEntities.value = structuredClone(toRaw(newVal))),
  )

  const addTreatment = async () => {
    if (!newTreatmentName.value.trim()) return
    await treatmentModel.add({ name: newTreatmentName.value })
    newTreatmentName.value = ''
    treatmentModel.fetchAll()
  }
  const deleteTreatment = async (id: number) => {
    await treatmentModel.delete(id)
    treatmentModel.fetchAll()
  }

  const updateTreatment = async (id: number, dto: UpdateTreatmentDto) => {
    await treatmentModel.update(id, dto)
    treatmentModel.fetchAll()
  }

  const cancelAllChanges = () => treatmentModel.fetchAll()

  const saveAllChanges = async () => {
    if (treatmentEntities.value.length) {
      await treatmentModel.updateBatch(treatmentEntities.value)
      treatmentModel.fetchAll()
    }
  }

  return {
    treatmentEntities,
    newTreatmentName,
    isLoading: treatmentModel.isLoading,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    cancelAllChanges,
    saveAllChanges,
  }
}
