import type { PriceDto, CreatePriceDto, UpdatePriceDto, UpdatePriceBatchDto } from './types'
import type { ApiResponseDto } from '@/shared/api/types'
import { createCrudApi } from '@/shared/lib/crud/createCrudApi'
import { apiClient } from '@/shared/api/client'

const priceApiBase = createCrudApi<PriceDto, CreatePriceDto, UpdatePriceDto>({
  type: 'entity',
  url: 'prices',
})

export const priceApi = {
  ...priceApiBase,
  async updateBatch(dtoArr: UpdatePriceBatchDto[]): Promise<ApiResponseDto<never>> {
    return apiClient.patch(`${priceApiBase.url}/batch`, dtoArr).then((res) => res.data)
  },
}
