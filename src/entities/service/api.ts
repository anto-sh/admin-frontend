import { apiClient } from '@/shared/api/client'
import type { CreateServiceDto, ServiceDto, UpdateServiceDto } from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const serviceApi = {
  async getAll(): Promise<ApiResponse<ServiceDto[]>> {
    const { data: response } = await apiClient.get('/services')
    return response
  },
  async getById(id: number): Promise<ApiResponse<ServiceDto>> {
    const { data: response } = await apiClient.get(`/services/${id}`)
    return response
  },
  async add(dto: CreateServiceDto): Promise<ApiResponse<ServiceDto>> {
    const { data: response } = await apiClient.post('/services', dto)
    return response
  },
  async update(id: number, dto: UpdateServiceDto): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.put(`/services/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.delete(`/services/${id}`)
    return response
  },
}
