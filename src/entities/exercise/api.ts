import { apiClient } from '@/shared/api/client'
import type { CreateExerciseDto, ExerciseDto, UpdateExerciseDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const exerciseApi = {
  async getAll(): Promise<ApiResponseDto<ExerciseDto[]>> {
    const { data: response } = await apiClient.get('/exercises')
    return response
  },
  async getById(id: number): Promise<ApiResponseDto<ExerciseDto[]>> {
    const { data: response } = await apiClient.get(`/exercises/${id}`)
    return response
  },
  async add(dto: CreateExerciseDto): Promise<ApiResponseDto<ExerciseDto>> {
    const { data: response } = await apiClient.post('/exercises', dto)
    return response
  },
  async update(id: number, dto: UpdateExerciseDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/exercises/${id}`, dto)
    return response
  },

  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/exercises/${id}`)
    return response
  },
}
