import { readonly, ref, type Ref } from 'vue'
import type {
  EntityCrudApi,
  CategoryCrudApi,
  CategoryCrudComposable,
  CrudComposable,
  EntityCrudComposable,
} from './types'

/**
 * Фабрика для создания базовых store-like CRUD composables.
 * Изначально для слоя бизнес-сущностей (entities) в качестве model.
 * @param { CrudComposable } crudApi - CRUD API-клиент
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

    // IT'S READONLY IN OTHER LAYERS
    const isLoading = ref(false)

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
          items.value = items.value.filter((i) => i.id !== id)
        } finally {
          isLoading.value = false
        }
      },
    }

    const specificMethods: Pick<
      ReturnType<CrudComposable<TResponseDto, TCreateDto, TUpdateDto>>,
      'fetchById' | 'fetchAllWithEntities'
    > = {}

    if (isCrudForEntity)
      specificMethods.fetchById = async (id: number) => {
        isLoading.value = true
        try {
          const { data } = await crudApi.getById(id)
          if (data) return data
        } finally {
          isLoading.value = false
        }
      }
    else
      specificMethods.fetchAllWithEntities = async () => {
        isLoading.value = true
        try {
          const { data } = await crudApi.getAllWithEntities()
          if (data) items.value = data
        } finally {
          isLoading.value = false
        }
      }

    return {
      [isCrudForEntity ? 'entities' : 'categories']: readonly(items),
      // IT'S READONLY IN OTHER LAYERS
      isLoading,
      ...baseCrudMethods,
      ...specificMethods,
    }
  }
}
