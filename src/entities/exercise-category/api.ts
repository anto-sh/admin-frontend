import { apiClient } from '@/shared/api/client'
import type { CreateExerciseCategoryDto, ExerciseCategoryDto, UpdateExerciseCategoryDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const exerciseCategoryApi = {
  async getAllWithExercises(): Promise<ApiResponseDto<ExerciseCategoryDto[]>> {
    const { data: response } = await apiClient.get('/exercise-categories')
    return response
  },
  async add(dto: CreateExerciseCategoryDto): Promise<ApiResponseDto<ExerciseCategoryDto>> {
    const { data: response } = await apiClient.post('/exercise-categories', dto)
    return response
  },
  async update(id: number, dto: UpdateExerciseCategoryDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/exercise-categories/${id}`, dto)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/exercise-categories/${id}`)
    return response
  },
}
