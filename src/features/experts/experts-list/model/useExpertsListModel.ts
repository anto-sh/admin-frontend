import { useExpertCategoryModel } from '@/entities/expert-category/model'
import { computed, onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useExpertModel } from '@/entities/expert/model'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useExpertsListModel() {
  const expertCategoryModel = useExpertCategoryModel()
  const expertModel = useExpertModel()
  const confirmService = useConfirm()
  const router = useRouter()

  const isLoading = computed(
    () => expertCategoryModel.isLoading.value || expertCategoryModel.isLoading.value,
  )

  onMounted(() => {
    expertCategoryModel.fetchAllWithEntities()
  })

  const confirmDeleteExpert = (id: number, event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: `Вы уверены, что хотите удалить специалиста?`,
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
        await expertModel.delete(id)
        expertCategoryModel.fetchAllWithEntities()
      },
    })
  }

  const goToExpertCreate = (categoryId?: number) => {
    router.push({
      name: 'expert-editor',
      query: { categoryId },
    })
  }

  const goToExpertEdit = (id: number) => {
    router.push({
      name: 'expert-editor',
      params: { id },
    })
  }

  const goToExpertView = (id: number) => {
    router.push({
      name: 'expert-editor',
      params: { id },
      query: { readonly: STRING_BOOLEAN.True },
    })
  }

  return {
    categoriesWithExperts: expertCategoryModel.categories,
    isLoading,
    confirmDeleteExpert,
    goToExpertCreate,
    goToExpertEdit,
    goToExpertView,
  }
}
