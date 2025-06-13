import { useServiceCategoryStore } from '@/entities/service-category/store'
import { useServiceStore } from '@/entities/service/store'
import { onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useRouter } from 'vue-router'
import { StringBoolean } from '@/shared/enums/common'

export function useServicesListModel() {
  const serviceCategoryStore = useServiceCategoryStore()
  const serviceStore = useServiceStore()
  const confirmService = useConfirm()
  const router = useRouter()

  onMounted(() => {
    serviceCategoryStore.fetchServiceCategoriesWithServices()
  })

  const confirmDeleteService = (id: number, event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: `Вы уверены?`,
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
        await serviceStore.deleteService(id)
        serviceCategoryStore.fetchServiceCategoriesWithServices()
      },
    })
  }

  const goToServiceCreate = (categoryId?: number) => {
    router.push({
      name: 'service-editor',
      query: { categoryId },
    })
  }

  const goToServiceEdit = (id: number) => {
    router.push({
      name: 'service-editor',
      params: { id },
    })
  }

  const goToServiceView = (id: number) => {
    router.push({
      name: 'service-editor',
      params: { id },
      query: { readonly: StringBoolean.True },
    })
  }

  return {
    serviceCategoryStore,
    confirmDeleteService,
    goToServiceCreate,
    goToServiceEdit,
    goToServiceView,
  }
}
