import { apiClient } from '@/shared/api/client'
import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
  UpdateExerciseCategoryDto,
} from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const exerciseCategoryApi = {
  async getAll(): Promise<ApiResponse<ExerciseCategoryDto[]>> {
    const { data: response } = await apiClient.get('/exercise-categories')
    return response
  },
  async getAllWithExercises(): Promise<ApiResponse<ExerciseCategoryDto[]>> {
    const { data: response } = await apiClient.get('/exercise-categories/with-entities')
    return response
  },
  async add(dto: CreateExerciseCategoryDto): Promise<ApiResponse<ExerciseCategoryDto>> {
    const { data: response } = await apiClient.post('/exercise-categories', dto)
    return response
  },
  async update(id: number, dto: UpdateExerciseCategoryDto): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.put(`/exercise-categories/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponse<never>> {
    const { data: response } = await apiClient.delete(`/exercise-categories/${id}`)
    return response
  },
}
