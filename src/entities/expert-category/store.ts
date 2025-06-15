import { defineStore } from 'pinia'
import { expertCategoryApi } from './api'
import type { ExpertCategoryDto } from './types'
import { ref } from 'vue'

export const useExpertCategoryStore = defineStore('ExpertCategory', () => {
  const expertCategories = ref<ExpertCategoryDto[]>([])

  async function fetchExpertCategories() {
    const res = await expertCategoryApi.getAll()
    if (res.data) expertCategories.value = res.data
  }

  async function fetchExpertCategoriesWithExperts() {
    const res = await expertCategoryApi.getAllWithExperts()
    if (res.data) expertCategories.value = res.data
  }

  return {
    expertCategories,
    fetchExpertCategories,
    fetchExpertCategoriesWithExperts,
  }
})
