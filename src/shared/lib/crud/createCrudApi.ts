import type { ApiResponseDto } from '@/shared/api/types'
import type { CrudApi, CreateCrudApiOptions, CategoryCrudApi, EntityCrudApi } from './types'
import { apiClient } from '@/shared/api/client'

/**
 * Фабрика для создания базовых CRUD API-клиентов.
 * Изначально для слоя бизнес-сущностей (entities)
 *
 * @param { CreateCrudApiOptions } options - Определяющие параметры
 * @param { "entity" | "category" } options.type "entity" | "category" - Влияет на наличие специфичных методов
 * @param { string } options.url - Адрес эндпоинта в формате '/endpoint-url'
 */

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateCrudApiOptions<'entity'>,
): EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateCrudApiOptions<'category'>,
): CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(options: CreateCrudApiOptions) {
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
    CrudApi<TResponseDto, TCreateDto, TUpdateDto>,
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
    url: options.url,
    ...baseCrudMethods,
    ...specificMethods,
  }
}
