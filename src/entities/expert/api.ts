import { apiClient } from '@/shared/api/client'
import type { CreateExpertDto, ExpertDto, UpdateExpertDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const expertApi = {
  async getAll(): Promise<ApiResponseDto<ExpertDto[]>> {
    const { data: response } = await apiClient.get('/experts')
    return response
  },
  async getById(id: number): Promise<ApiResponseDto<ExpertDto>> {
    const { data: response } = await apiClient.get(`/experts/${id}`)
    return response
  },
  async add(dto: CreateExpertDto): Promise<ApiResponseDto<ExpertDto>> {
    const { data: response } = await apiClient.post('/experts', dto)
    return response
  },
  async update(id: number, dto: UpdateExpertDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/experts/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/experts/${id}`)
    return response
  },
}
