import { apiClient } from '@/shared/api/client'
import type {
  CreateTreatmentDto,
  TreatmentDto,
  UpdateTreatmentBatchDto,
  UpdateTreatmentDto,
} from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'
import { createCrudApi } from '@/shared/lib/crud'

export const treatmentApiBase = createCrudApi<TreatmentDto, CreateTreatmentDto, UpdateTreatmentDto>(
  {
    type: 'entity',
    url: '/treatments',
  },
)

export const treatmentApi = {
  ...treatmentApiBase,
  async updateBatch(dtoArr: UpdateTreatmentBatchDto[]): Promise<ApiResponse<never>> {
    return apiClient.patch(`${treatmentApiBase.url}/batch`, dtoArr).then((res) => res.data)
  },
}
