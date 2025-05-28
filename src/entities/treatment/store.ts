import { defineStore } from 'pinia'
import { treatmentApi } from './api'
import type { TreatmentAddDto, TreatmentDto, TreatmentUpdateDto } from './types'
import { ref } from 'vue'

export const useTreatmentStore = defineStore('Treatment', () => {
  const treatments = ref<TreatmentDto[] | undefined>([])
  const isLoading = ref(false)

  async function loadTreatments() {
    isLoading.value = true
    try {
      const res = await treatmentApi.fetchAll()
      treatments.value = res.data
    } finally {
      isLoading.value = false
    }
  }

  async function addTreatment(dto: TreatmentAddDto) {
    const res = await treatmentApi.add(dto)
    treatments.value?.push(res.data!)
  }

  async function saveAllTreatments() {
    const updateDtoArr: { id: number; dtoBody: TreatmentUpdateDto }[] = treatments.value!.map(
      (t) => {
        return { id: t.id, dtoBody: { name: t.name } }
      },
    )

    const requests = updateDtoArr.map((dto) => treatmentApi.update(dto.id, dto.dtoBody))
    await Promise.all(requests)
    loadTreatments()
  }

  return {
    treatments,
    isLoading,
    loadTreatments,
    addTreatment,
    saveAllTreatments,
  }
})
