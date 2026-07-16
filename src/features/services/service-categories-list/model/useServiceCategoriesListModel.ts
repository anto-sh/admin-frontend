import { useServiceCategoryModel } from '@/entities/service-category/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateServiceCategoryDto,
  ServiceCategoryDto,
} from '@/entities/service-category/types'
import { slugify } from 'transliteration'
import { useConfirm } from 'primevue'

export function useServiceCategoriesListModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const newServiceCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newServiceCategory = ref<CreateServiceCategoryDto>({ ...newServiceCategoryDefaultValue })
  const confirmService = useConfirm()

  const categoriesWithServices = ref<ServiceCategoryDto[]>([])

  onMounted(() => {
    serviceCategoryModel.fetchAllWithEntities()
  })

  watch(
    serviceCategoryModel.categories,
    () => {
      categoriesWithServices.value = structuredClone(toRaw(serviceCategoryModel.categories.value))
    },
    { deep: false },
  )

  const addServiceCategory = async (dto: CreateServiceCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await serviceCategoryModel.add(dto)
    newServiceCategory.value = { ...newServiceCategoryDefaultValue }
    serviceCategoryModel.fetchAllWithEntities()
  }
  const updateServiceCategory = async (id: number, dto: CreateServiceCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await serviceCategoryModel.update(id, dto)
    serviceCategoryModel.fetchAllWithEntities()
  }

  const confirmDeleteServiceCategory = async (
    id: number,
    relatedServicesLength: number | undefined,
    event: MouseEvent,
  ) => {
    if (relatedServicesLength)
      confirmService.require({
        target: event.target as HTMLElement,
        message: `При удалении категории удалятся и все входящие в неё услуги.
                  \n Сейчас в этой категории ${relatedServicesLength} услуг.
                  \n Вы уверены в удалении этой категории?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
          label: 'Нет',
          severity: 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: 'Да',
          severity: 'danger',
        },
        accept: async () => {
          await serviceCategoryModel.delete(id)
        },
      })
    else await serviceCategoryModel.delete(id)
  }

  return {
    categoriesWithServices,
    newServiceCategory,
    addServiceCategory,
    updateServiceCategory,
    confirmDeleteServiceCategory,
  }
}
