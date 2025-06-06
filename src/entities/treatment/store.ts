import { defineStore } from 'pinia'
import { treatmentApi } from './api'
import type { CreateTreatmentDto, TreatmentDto, UpdateTreatmentDto } from './types'
import { ref } from 'vue'

export const useTreatmentStore = defineStore('Treatment', () => {
  const treatments = ref<TreatmentDto[]>([])

  async function fetchTreatments() {
    const res = await treatmentApi.getAll()
    if (res.data) treatments.value = res.data
  }

  async function addTreatment(dto: CreateTreatmentDto) {
    const res = await treatmentApi.add(dto)
    if (res.data) treatments.value?.push(res.data)
  }

  async function updateTreatment(id: number, dto: UpdateTreatmentDto) {
    await treatmentApi.update(id, dto)
  }

  async function updateAllTreatments() {
    if (treatments.value.length) await treatmentApi.updateBatch(treatments.value)
  }

  async function deleteTreatment(id: number) {
    await treatmentApi.delete(id)
    treatments.value = treatments.value?.filter((t) => t.id !== id)
  }

  return {
    treatments,
    fetchTreatments,
    addTreatment,
    updateTreatment,
    updateAllTreatments,
    deleteTreatment,
  }
})
