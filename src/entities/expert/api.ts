import { apiClient } from '@/shared/api/client'
import type { CreateExpertDto, ExpertDto, UpdateExpertDto } from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const expertApi = {
  async getAll(): Promise<ApiResponse<ExpertDto[]>> {
    const { data: response } = await apiClient.get('/experts')
    return response
  },
  async getById(id: number): Promise<ApiResponse<ExpertDto>> {
    const { data: response } = await apiClient.get(`/experts/${id}`)
    return response
  },
  async add(dto: CreateExpertDto): Promise<ApiResponse<ExpertDto>> {
    const { data: response } = await apiClient.post('/experts', dto)
    return response
  },
  async update(id: number, dto: UpdateExpertDto): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.put(`/experts/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.delete(`/experts/${id}`)
    return response
  },
}
