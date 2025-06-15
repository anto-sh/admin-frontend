import { defineStore } from 'pinia'
import { expertApi } from './api'
import type { CreateExpertDto, ExpertDto, UpdateExpertDto } from './types'
import { ref } from 'vue'

export const useExpertStore = defineStore('Expert', () => {
  const experts = ref<ExpertDto[]>([])

  async function fetchExperts() {
    const res = await expertApi.getAll()
    if (res.data) experts.value = res.data
  }

  async function fetchExpertById(id: number) {
    return await expertApi.getById(id)
  }

  async function addExpert(dto: CreateExpertDto) {
    const res = await expertApi.add(dto)
    if (res.data) experts.value?.push(res.data)
  }

  async function updateExpert(id: number, dto: UpdateExpertDto) {
    await expertApi.update(id, dto)
  }

  async function deleteExpert(id: number) {
    await expertApi.delete(id)
    experts.value = experts.value?.filter((t) => t.id !== id)
  }

  return {
    experts,
    fetchExperts,
    fetchExpertById,
    addExpert,
    updateExpert,
    deleteExpert,
  }
})
