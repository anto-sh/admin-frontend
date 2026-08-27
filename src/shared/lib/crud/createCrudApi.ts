import type { ApiResponse } from '@anto-sh/admin-network-shared'
import type { CreateCrudApiOptions, CategoryCrudApi, EntityCrudApi } from './types'
import { apiClient } from '@/shared/api/client'

/**
 * Фабрика для создания базовых CRUD API-клиентов.
 * Изначально для слоя бизнес-сущностей (entities)
 *
 * @param { CreateCrudApiOptions } options - Определяющие параметры
 * @param { "entity" | "category" } options.type "entity" | "category" - Влияет на наличие специфичных методов
 * @param { string } options.url - Адрес эндпоинта в формате '/endpoint-url'
 * @returns { EntityCrudApi | CategoryCrudApi } CRUD API
 */

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateCrudApiOptions<'entity'>,
): EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(
  options: CreateCrudApiOptions<'category'>,
): CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudApi<TResponseDto, TCreateDto, TUpdateDto>(options: CreateCrudApiOptions) {
  const baseCrudMethods = {
    getAll(abortSignal?: AbortSignal): Promise<ApiResponse<TResponseDto[]>> {
      return apiClient.get(options.url, { signal: abortSignal }).then((res) => res.data)
    },
    add(dto: TCreateDto, abortSignal?: AbortSignal): Promise<ApiResponse<TResponseDto>> {
      return apiClient.post(options.url, dto, { signal: abortSignal }).then((res) => res.data)
    },
    update(id: number, dto: TUpdateDto, abortSignal?: AbortSignal): Promise<ApiResponse<never>> {
      return apiClient
        .put(`${options.url}/${id}`, dto, { signal: abortSignal })
        .then((res) => res.data)
    },
    delete(id: number, abortSignal?: AbortSignal): Promise<ApiResponse<never>> {
      return apiClient
        .delete(`${options.url}/${id}`, { signal: abortSignal })
        .then((res) => res.data)
    },
  }

  const specificMethods =
    options.type === 'entity'
      ? {
          getById(id: number, abortSignal?: AbortSignal): Promise<ApiResponse<TResponseDto>> {
            return apiClient
              .get(`${options.url}/${id}`, { signal: abortSignal })
              .then((res) => res.data)
          },
        }
      : {
          getAllWithEntities(abortSignal?: AbortSignal): Promise<ApiResponse<TResponseDto[]>> {
            return apiClient
              .get(`${options.url}/with-entities`, { signal: abortSignal })
              .then((res) => res.data)
          },
        }

  return {
    url: options.url,
    ...baseCrudMethods,
    ...specificMethods,
  }
}
