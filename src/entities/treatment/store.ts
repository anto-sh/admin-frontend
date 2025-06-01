import { defineStore } from 'pinia'
import { treatmentApi } from './api'
import type { AddTreatmentDto, TreatmentDto, UpdateTreatmentDto } from './types'
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

  async function addTreatment(dto: AddTreatmentDto) {
    const res = await treatmentApi.add(dto)
    treatments.value?.push(res.data!)
  }

  async function updateTreatment(id: number, dto: UpdateTreatmentDto) {
    await treatmentApi.update(id, dto)
  }

  async function updateAllTreatments() {
    await treatmentApi.updateBatch(treatments.value!)
  }

  return {
    treatments,
    isLoading,
    loadTreatments,
    addTreatment,
    updateTreatment,
    updateAllTreatments,
  }
})
