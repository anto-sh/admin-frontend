import { apiClient } from '@/shared/api/client'
import type { AddTreatmentDto, TreatmentDto, UpdateTreatmentBatchDto, UpdateTreatmentDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const treatmentApi = {
  async fetchAll(): Promise<ApiResponseDto<TreatmentDto[]>> {
    const { data: response } = await apiClient.get('/treatments/')
    return response
  },
  async add(dto: AddTreatmentDto): Promise<ApiResponseDto<TreatmentDto>> {
    const { data: response } = await apiClient.post('/treatments', dto)
    return response
  },
  async update(id: number, dto: UpdateTreatmentDto): Promise<ApiResponseDto<TreatmentDto>> {
    const { data: response } = await apiClient.put(`/treatments/${id}`, dto)
    return response
  },
  async updateBatch(dtoArr: UpdateTreatmentBatchDto[]): Promise<ApiResponseDto<unknown>> {
    const { data: response } = await apiClient.patch(`/treatments/`, dtoArr)
    return response
  }
}
