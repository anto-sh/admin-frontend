import { apiClient } from '@/shared/api/client'
import type { TreatmentAddDto, TreatmentDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const treatmentApi = {
  async fetchAll(): Promise<ApiResponseDto<TreatmentDto[]>> {
    const { data } = await apiClient.get('/treatments/')
    return data
  },
  async add(dto: TreatmentAddDto): Promise<ApiResponseDto<TreatmentDto>> {
    const { data } = await apiClient.post('/treatments', dto)
    return data
  },
  async update(id: number, dto: TreatmentAddDto): Promise<ApiResponseDto<TreatmentDto>> {
    const { data } = await apiClient.put(`/treatments/${id}`, dto)
    return data
  },
}
