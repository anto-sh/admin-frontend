import { defineStore } from 'pinia'
import { priceApi } from './api'
import type { PriceDto, CreatePriceDto, UpdatePriceDto, UpdatePriceBatchDto } from './types'
import { ref } from 'vue'

export const usePriceStore = defineStore('Price', () => {
  const prices = ref<PriceDto[]>([])

  async function fetchPrices() {
    const res = await priceApi.getAll()
    if (res.data) prices.value = res.data
  }

  async function fetchPriceById(id: number) {
    return await priceApi.getById(id)
  }

  async function addPrice(dto: CreatePriceDto) {
    const res = await priceApi.add(dto)
    if (res.data) prices.value.push(res.data)
  }

  async function updatePrice(id: number, dto: UpdatePriceDto) {
    await priceApi.update(id, dto)
    // Можно обновить локально, если нужно
  }

  async function updatePricesBatch(dtoArr: UpdatePriceBatchDto[]) {
    await priceApi.updateBatch(dtoArr)
    await fetchPrices()
  }

  async function deletePrice(id: number) {
    await priceApi.delete(id)
    prices.value = prices.value.filter((t) => t.id !== id)
  }

  return {
    prices,
    fetchPrices,
    fetchPriceById,
    addPrice,
    updatePrice,
    updatePricesBatch,
    deletePrice,
  }
})
