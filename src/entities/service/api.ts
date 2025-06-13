import { apiClient } from '@/shared/api/client'
import type { CreateServiceDto, ServiceDto, UpdateServiceDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const serviceApi = {
  async getAll(): Promise<ApiResponseDto<ServiceDto[]>> {
    const { data: response } = await apiClient.get('/services')
    return response
  },
  async getById(id: number): Promise<ApiResponseDto<ServiceDto>> {
    const { data: response } = await apiClient.get(`/services/${id}`)
    return response
  },
  async add(dto: CreateServiceDto): Promise<ApiResponseDto<ServiceDto>> {
    const { data: response } = await apiClient.post('/services', dto)
    return response
  },
  async update(id: number, dto: UpdateServiceDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/services/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/services/${id}`)
    return response
  },
}
