import { apiClient } from './client'
import type { ApiResponseDto, EntityApi, entityApiFabricOptions } from './types'

export default function entityApiFabric<TResponseDto, TCreateDto, TUpdateDto>(
  options: entityApiFabricOptions,
) {
  const baseCrudMethods = {
    getAll(): Promise<ApiResponseDto<TResponseDto[]>> {
      return apiClient.get(options.url).then((res) => res.data)
    },
    add(dto: TCreateDto): Promise<ApiResponseDto<TResponseDto>> {
      return apiClient.post(options.url, dto).then((res) => res.data)
    },
    update(id: number, dto: TUpdateDto): Promise<ApiResponseDto<never>> {
      return apiClient.put(`${options.url}/${id}`, dto).then((res) => res.data)
    },
    delete(id: number): Promise<ApiResponseDto<never>> {
      return apiClient.delete(`${options.url}/${id}`).then((res) => res.data)
    },
  }

  const specificMethods: Pick<
    EntityApi<TResponseDto, TCreateDto, TUpdateDto>,
    'getById' | 'getAllWithEntities'
  > = {}

  if (options.type === 'entity')
    specificMethods.getById = (id: number): Promise<ApiResponseDto<TResponseDto>> => {
      return apiClient.get(`${options.url}/${id}`).then((res) => res.data)
    }
  else
    specificMethods.getAllWithEntities = (): Promise<ApiResponseDto<TResponseDto[]>> => {
      return apiClient.get(`${options.url}/with-entities}`).then((res) => res.data)
    }

  return {
    ...baseCrudMethods,
    ...specificMethods,
  }
}
