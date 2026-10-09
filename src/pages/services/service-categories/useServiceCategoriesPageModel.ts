import { useServiceCategoryModel } from '@/entities/service-category/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
} from '@/entities/service-category/types'
import { slugify } from 'transliteration'
import { useEntityArrDirtyTracker } from '@/shared/composables/editable-entity-list/useEntityArrDirtyTracker'

export function useServiceCategoriesPageModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const newServiceCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newServiceCategory = ref<CreateServiceCategoryDto>({ ...newServiceCategoryDefaultValue })

  const categoriesWithServices = ref<ServiceCategoryDto[]>([])

  onMounted(() => {
    serviceCategoryModel.fetchAllWithEntities()
  })

  watch(serviceCategoryModel.categories, (newVal) => {
    categoriesWithServices.value = structuredClone(toRaw(newVal))
  })

  const addServiceCategory = async () => {
    if (!newServiceCategory.value.url)
      newServiceCategory.value.url = slugify(newServiceCategory.value.name!)
    await serviceCategoryModel.add(newServiceCategory.value)
    newServiceCategory.value = { ...newServiceCategoryDefaultValue }
    serviceCategoryModel.fetchAllWithEntities()
  }
  const updateServiceCategory = async (id: number, dto: CreateServiceCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await serviceCategoryModel.update(id, dto)
    serviceCategoryModel.fetchAllWithEntities()
  }

  const deleteServiceCategory = async (id: number) => {
    await serviceCategoryModel.delete(id)
    serviceCategoryModel.fetchAllWithEntities()
  }

  const { dirtyIds, cancelChange } = useEntityArrDirtyTracker(
    categoriesWithServices,
    () => serviceCategoryModel.categories.value,
    ['name', 'url'],
  )

  return {
    categoriesWithServices,
    newServiceCategory,
    isLoading: serviceCategoryModel.isLoading,
    dirtyIds,
    addServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    cancelChange,
  }
}
