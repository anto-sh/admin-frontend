// api/expert-category/api.ts
import { apiClient } from '@/shared/api/client'
import type { ExpertCategoryDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const expertCategoryApi = {
  async getAll(): Promise<ApiResponseDto<ExpertCategoryDto[]>> {
    const { data: response } = await apiClient.get('/expert-categories')
    return response
  },
  async getAllWithExperts(): Promise<ApiResponseDto<ExpertCategoryDto[]>> {
    const { data: response } = await apiClient.get('/expert-categories/with-experts')
    return response
  },
}
