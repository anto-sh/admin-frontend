import { defineStore } from 'pinia'
import { serviceCategoryApi } from './api'
import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
  UpdateServiceCategoryDto,
} from './types'
import { ref } from 'vue'

export const useServiceCategoryStore = defineStore('ServiceCategory', () => {
  const serviceCategories = ref<ServiceCategoryDto[]>([])

  async function fetchServiceCategories() {
    const res = await serviceCategoryApi.getAll()
    if (res.data) serviceCategories.value = res.data
  }

  async function fetchServiceCategoriesWithServices() {
    const res = await serviceCategoryApi.getAllWithServices()
    if (res.data) serviceCategories.value = res.data
  }

  async function addServiceCategory(dto: CreateServiceCategoryDto) {
    const res = await serviceCategoryApi.add(dto)
    if (res.data) serviceCategories.value?.push(res.data)
  }

  async function updateServiceCategory(id: number, dto: UpdateServiceCategoryDto) {
    const updatedCat = serviceCategories.value.find((cat) => cat.id === id)
    if (updatedCat) {
      if (dto.name !== undefined) updatedCat.name = dto.name
      if (dto.url !== undefined) updatedCat.url = dto.url
    }
    await serviceCategoryApi.update(id, dto)
  }

  async function deleteServiceCategory(id: number) {
    await serviceCategoryApi.delete(id)
    serviceCategories.value = serviceCategories.value?.filter((t) => t.id !== id)
  }

  return {
    serviceCategories,
    fetchServiceCategories,
    fetchServiceCategoriesWithServices,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
  }
})
