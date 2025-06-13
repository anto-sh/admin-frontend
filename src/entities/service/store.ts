import { defineStore } from 'pinia'
import { serviceApi } from './api'
import type { CreateServiceDto, ServiceDto, UpdateServiceDto } from './types'
import { ref } from 'vue'

export const useServiceStore = defineStore('Service', () => {
  const services = ref<ServiceDto[]>([])

  async function fetchServices() {
    const res = await serviceApi.getAll()
    if (res.data) services.value = res.data
  }

  async function fetchServiceById(id: number) {
    return await serviceApi.getById(id)
  }

  async function addService(dto: CreateServiceDto) {
    const res = await serviceApi.add(dto)
    if (res.data) services.value?.push(res.data)
  }

  async function updateService(id: number, dto: UpdateServiceDto) {
    await serviceApi.update(id, dto)
  }

  async function deleteService(id: number) {
    await serviceApi.delete(id)
    services.value = services.value?.filter((t) => t.id !== id)
  }

  return {
    services,
    fetchServices,
    fetchServiceById,
    addService,
    updateService,
    deleteService,
  }
})
