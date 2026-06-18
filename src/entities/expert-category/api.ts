// api/expert-category/api.ts
import { apiClient } from '@/shared/api/client'
import type { ExpertCategoryDto } from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const expertCategoryApi = {
  async getAll(): Promise<ApiResponse<ExpertCategoryDto[]>> {
    const { data: response } = await apiClient.get('/expert-categories')
    return response
  },
  async getAllWithExperts(): Promise<ApiResponse<ExpertCategoryDto[]>> {
    const { data: response } = await apiClient.get('/expert-categories/with-entities')
    return response
  },
}
