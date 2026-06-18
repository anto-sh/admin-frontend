import { apiClient } from '@/shared/api/client'
import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
  UpdateServiceCategoryDto,
} from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const serviceCategoryApi = {
  async getAll(): Promise<ApiResponse<ServiceCategoryDto[]>> {
    const { data: response } = await apiClient.get('/service-categories')
    return response
  },
  async getAllWithServices(): Promise<ApiResponse<ServiceCategoryDto[]>> {
    const { data: response } = await apiClient.get('/service-categories/with-entities')
    return response
  },
  async add(dto: CreateServiceCategoryDto): Promise<ApiResponse<ServiceCategoryDto>> {
    const { data: response } = await apiClient.post('/service-categories', dto)
    return response
  },
  async update(id: number, dto: UpdateServiceCategoryDto): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.put(`/service-categories/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.delete(`/service-categories/${id}`)
    return response
  },
}
