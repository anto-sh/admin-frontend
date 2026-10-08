import { useServiceCategoryModel } from '@/entities/service-category/model'
import { useServiceModel } from '@/entities/service/model'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useServicesListPageModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const serviceModel = useServiceModel()
  const router = useRouter()

  const isLoading = computed(
    () => serviceModel.isLoading.value || serviceCategoryModel.isLoading.value,
  )

  onMounted(() => {
    serviceCategoryModel.fetchAllWithEntities()
  })

  const deleteService = async (id: number) => {
    serviceModel.delete(id)
    await serviceCategoryModel.fetchAllWithEntities()
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
    deleteService,
    goToServiceCreate,
    goToServiceEdit,
    goToServiceView,
  }
}
