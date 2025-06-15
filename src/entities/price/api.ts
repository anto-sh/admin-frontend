import { apiClient } from '@/shared/api/client'
import type { PriceDto, CreatePriceDto, UpdatePriceDto, UpdatePriceBatchDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const priceApi = {
  async getAll(): Promise<ApiResponseDto<PriceDto[]>> {
    const { data: response } = await apiClient.get('/prices')
    return response
  },
  async getById(id: number): Promise<ApiResponseDto<PriceDto>> {
    const { data: response } = await apiClient.get(`/prices/${id}`)
    return response
  },
  async add(dto: CreatePriceDto): Promise<ApiResponseDto<PriceDto>> {
    const { data: response } = await apiClient.post('/prices', dto)
    return response
  },
  async update(id: number, dto: UpdatePriceDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/prices/${id}`, dto)
    return response
  },
  async updateBatch(dtoArr: UpdatePriceBatchDto[]): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.patch('/prices/batch', dtoArr)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/prices/${id}`)
    return response
  },
}
