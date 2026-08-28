import { onBeforeUnmount, readonly, ref, toRaw, type Ref } from 'vue'
import type {
  EntityCrudApi,
  CategoryCrudApi,
  CategoryCrudComposable,
  EntityCrudComposable,
} from './types'
import { usePendingRequestCounter } from '../network-utils/usePendingRequestCounter'

/**
 * Фабрика для создания базовых store-like CRUD composables.
 * Изначально для слоя бизнес-сущностей (entities) в качестве model для работы с локальным состоянием.
 * @param { EntityCrudApi | CategoryCrudApi } crudApi - CRUD API-клиент
 * @return { EntityCrudComposable | CategoryCrudComposable } CRUD Composable
 */

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi: EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
  useGlobalLoadingIndication?: boolean,
): EntityCrudComposable<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi: CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
  useGlobalLoadingIndication?: boolean,
): CategoryCrudComposable<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi:
    | EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>
    | CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
  useGlobalLoadingIndication: boolean = true,
) {
  const isCrudForEntity = 'getById' in crudApi

  return () => {
    const items: Ref<TResponseDto[]> = ref([]) as Ref<TResponseDto[]>
    const abortController = new AbortController()
    const abortSignal = abortController.signal

    let isLoadingTimeout: number
    const isLoading = ref(false)
    // debounced on set `false` to prevent flashing of loading indicator
    function setIsLoading(val: boolean) {
      if (!val) {
        clearTimeout(isLoadingTimeout)
        isLoadingTimeout = setTimeout(() => {
          isLoading.value = false
        }, 200)
      } else isLoading.value = true
    }

    const pendingRequestCounter = usePendingRequestCounter(setIsLoading, useGlobalLoadingIndication)

    const baseCrudMethods = {
      async fetchAll() {
        pendingRequestCounter.start()
        try {
          const { data } = await crudApi.getAll(abortSignal)
          if (data) items.value = data
        } finally {
          pendingRequestCounter.finish()
        }
      },
      async add(dto: TCreateDto) {
        pendingRequestCounter.start()
        try {
          const { data } = await crudApi.add(dto, abortSignal)
          if (data) items.value.push(data)
        } finally {
          pendingRequestCounter.finish()
        }
      },
      async update(id: number, dto: TUpdateDto) {
        pendingRequestCounter.start()
        try {
          await crudApi.update(id, dto, abortSignal)
        } finally {
          pendingRequestCounter.finish()
        }
      },
      async delete(id: number) {
        pendingRequestCounter.start()
        try {
          await crudApi.delete(id, abortSignal)
          items.value = toRaw(items.value).filter((i) => {
            return i.id !== id
          })
        } finally {
          pendingRequestCounter.finish()
        }
      },
    }

    const specificMethods = isCrudForEntity
      ? {
          async fetchById(id: number) {
            pendingRequestCounter.start()
            try {
              const { data } = await crudApi.getById(id, abortSignal)
              if (data) return data
            } finally {
              pendingRequestCounter.finish()
            }
          },
        }
      : {
          async fetchAllWithEntities() {
            pendingRequestCounter.start()
            try {
              const { data } = await crudApi.getAllWithEntities(abortSignal)
              if (data) items.value = data
            } finally {
              pendingRequestCounter.finish()
            }
          },
        }

    onBeforeUnmount(() => {
      abortController.abort()
      pendingRequestCounter.finishAll()
      if (isLoadingTimeout) clearTimeout(isLoadingTimeout)
      // isLoading will be destroyed during unmounting
    })

    return {
      [isCrudForEntity ? 'entities' : 'categories']: readonly(items),
      // When using this model, consider isLoading to be a read-only property
      // It is not "physically" read-only, as it needs to be modified when extending baseCrud with custom methods
      isLoading: isLoading,
      abortSignal,
      pendingRequestCounter,
      ...baseCrudMethods,
      ...specificMethods,
    }
  }
}
