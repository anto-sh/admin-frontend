import { customRef, readonly, ref, toRaw, type Ref } from 'vue'
import type {
  EntityCrudApi,
  CategoryCrudApi,
  CategoryCrudComposable,
  EntityCrudComposable,
} from './types'

/**
 * Фабрика для создания базовых store-like CRUD composables.
 * Изначально для слоя бизнес-сущностей (entities) в качестве model для работы с локальным состоянием.
 * @param { EntityCrudApi | CategoryCrudApi } crudApi - CRUD API-клиент
 * @return { EntityCrudComposable | CategoryCrudComposable } - CRUD Composable
 */

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi: EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
): EntityCrudComposable<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi: CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
): CategoryCrudComposable<TResponseDto, TCreateDto, TUpdateDto>

export function createCrudComposable<TResponseDto extends { id: number }, TCreateDto, TUpdateDto>(
  crudApi:
    | EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>
    | CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>,
) {
  const isCrudForEntity = 'getById' in crudApi

  return () => {
    const items: Ref<TResponseDto[]> = ref([]) as Ref<TResponseDto[]>

    // debouncing customRef
    const isLoading = customRef((track, trigger) => {
      let value = false
      let isLoadingTimeout: number
      return {
        get() {
          track()
          return value
        },
        // only set to false is debounced to prevent flashing
        set(newValue: boolean) {
          if (!newValue) {
            clearTimeout(isLoadingTimeout)
            isLoadingTimeout = setTimeout(() => {
              value = newValue
              trigger()
            }, 200)
          } else {
            value = newValue
            trigger()
          }
        },
      }
    })

    const baseCrudMethods = {
      async fetchAll() {
        isLoading.value = true
        try {
          const { data } = await crudApi.getAll()
          if (data) items.value = data
        } finally {
          isLoading.value = false
        }
      },
      async add(dto: TCreateDto) {
        isLoading.value = true
        try {
          const { data } = await crudApi.add(dto)
          if (data) items.value.push(data)
        } finally {
          isLoading.value = false
        }
      },
      async update(id: number, dto: TUpdateDto) {
        isLoading.value = true
        try {
          await crudApi.update(id, dto)
        } finally {
          isLoading.value = false
        }
      },
      async delete(id: number) {
        isLoading.value = true
        try {
          await crudApi.delete(id)
          items.value = toRaw(items.value).filter((i) => {
            return i.id !== id
          })
        } finally {
          isLoading.value = false
        }
      },
    }

    const specificMethods = isCrudForEntity
      ? {
          async fetchById(id: number) {
            isLoading.value = true
            try {
              const { data } = await crudApi.getById(id)
              if (data) return data
            } finally {
              isLoading.value = false
            }
          },
        }
      : {
          async fetchAllWithEntities() {
            isLoading.value = true
            try {
              const { data } = await crudApi.getAllWithEntities()
              if (data) items.value = data
            } finally {
              isLoading.value = false
            }
          },
        }

    return {
      [isCrudForEntity ? 'entities' : 'categories']: readonly(items),
      isLoading: isLoading,
      ...baseCrudMethods,
      ...specificMethods,
    }
  }
}
