import { useServiceCategoryStore } from '@/entities/service-category/store'
import { onMounted, ref } from 'vue'
import type { CreateServiceCategoryDto } from '@/entities/service-category/types'
import { slugify } from 'transliteration'
import { useConfirm } from 'primevue'

export function useServiceCategoriesListModel() {
  const serviceCategoryStore = useServiceCategoryStore()
  const newServiceCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newServiceCategory = ref<CreateServiceCategoryDto>({ ...newServiceCategoryDefaultValue })
  const confirmService = useConfirm()

  onMounted(() => {
    serviceCategoryStore.fetchServiceCategoriesWithServices()
  })

  const addServiceCategory = async (dto: CreateServiceCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await serviceCategoryStore.addServiceCategory(dto)
    newServiceCategory.value = { ...newServiceCategoryDefaultValue }
  }
  const updateServiceCategory = (id: number, dto: CreateServiceCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    serviceCategoryStore.updateServiceCategory(id, dto)
  }

  const confirmDeleteServiceCategory = (
    id: number,
    relatedServicesLength: number | undefined,
    event: MouseEvent,
  ) => {
    if (relatedServicesLength)
      confirmService.require({
        target: event.target as HTMLElement,
        message: `При удалении категории удалятся и все входящие в неё услуги.\n Сейчас в этой категории ${relatedServicesLength} услуг.\n Вы уверены в удалении этой категории?`,
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
        accept: () => {
          serviceCategoryStore.deleteServiceCategory(id)
        },
      })
    else serviceCategoryStore.deleteServiceCategory(id)
  }

  return {
    serviceCategoryStore,
    newServiceCategory,
    addServiceCategory,
    updateServiceCategory,
    confirmDeleteServiceCategory,
  }
}
