import { apiClient } from '@/shared/api/client'
import type {
  AddTreatmentDto,
  TreatmentDto,
  UpdateTreatmentBatchDto,
  UpdateTreatmentDto,
} from './types'
import type { ApiResponseDto } from '@/shared/api/types'

export const treatmentApi = {
  async getAll(): Promise<ApiResponseDto<TreatmentDto[]>> {
    const { data: response } = await apiClient.get('/treatments/')
    return response
  },
  async add(dto: AddTreatmentDto): Promise<ApiResponseDto<TreatmentDto>> {
    const { data: response } = await apiClient.post('/treatments', dto)
    return response
  },
  async update(id: number, dto: UpdateTreatmentDto): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.put(`/treatments/${id}`, dto)
    return response
  },
  async updateBatch(dtoArr: UpdateTreatmentBatchDto[]): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.patch(`/treatments/`, dtoArr)
    return response
  },
  async delete(id: number): Promise<ApiResponseDto<never>> {
    const { data: response } = await apiClient.delete(`/treatments/${id}`)
    return response
  },
}
