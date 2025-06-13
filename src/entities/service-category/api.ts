import { apiClient } from '@/shared/api/client'
import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
  UpdateServiceCategoryDto,
} from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const serviceCategoryApi = {
  async getAll(): Promise<ApiResponseDto<ServiceCategoryDto[]>> {
    const { data: response } = await apiClient.get('/service-categories')
    return response
  },
  async getAllWithServices(): Promise<ApiResponseDto<ServiceCategoryDto[]>> {
    const { data: response } = await apiClient.get('/service-categories/with-services')
    return response
  },
  async add(dto: CreateServiceCategoryDto): Promise<ApiResponseDto<ServiceCategoryDto>> {
    const { data: response } = await apiClient.post('/service-categories', dto)
    return response
  },
  async update(id: number, dto: UpdateServiceCategoryDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/service-categories/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/service-categories/${id}`)
    return response
  },
}
