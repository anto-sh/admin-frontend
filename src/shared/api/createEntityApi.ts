import { apiClient } from './client'
import type { ApiResponseDto, EntityApi, CreateEntityApiOptions } from './types'

export function createEntityApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateEntityApiOptions<'entity'>,
): Required<Omit<EntityApi<TResponseDto, TCreateDto, TUpdateDto>, 'getAllWithEntities'>>
export function createEntityApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateEntityApiOptions<'category'>,
): Required<Omit<EntityApi<TResponseDto, TCreateDto, TUpdateDto>, 'getById'>>

export function createEntityApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateEntityApiOptions,
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
