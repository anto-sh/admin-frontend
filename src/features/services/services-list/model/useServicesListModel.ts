import { useServiceCategoryModel } from '@/entities/service-category/model'
import { useServiceModel } from '@/entities/service/model'
import { computed, onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useServicesListModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const serviceModel = useServiceModel()
  const confirmService = useConfirm()
  const router = useRouter()

  const isLoading = computed(
    () => serviceModel.isLoading.value || serviceCategoryModel.isLoading.value,
  )

  onMounted(() => {
    serviceCategoryModel.fetchAllWithEntities()
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
        await serviceModel.delete(id)
        serviceCategoryModel.fetchAllWithEntities()
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
      query: { readonly: STRING_BOOLEAN.True },
    })
  }

  return {
    categoriesWithServices: serviceCategoryModel.categories,
    isLoading,
    serviceCategoryModel,
    confirmDeleteService,
    goToServiceCreate,
    goToServiceEdit,
    goToServiceView,
  }
}
