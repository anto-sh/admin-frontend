import { useExpertCategoryStore } from '@/entities/expert-category/store'
import { onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useExpertStore } from '@/entities/expert/store'
import { useRouter } from 'vue-router'
import { StringBoolean } from '@/shared/enums/common'

export function useExpertsListModel() {
  const expertCategoryStore = useExpertCategoryStore()
  const expertStore = useExpertStore()
  const confirmService = useConfirm()
  const router = useRouter()

  onMounted(() => {
    expertCategoryStore.fetchExpertCategoriesWithExperts()
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
        await expertStore.deleteExpert(id)
        expertCategoryStore.fetchExpertCategoriesWithExperts()
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
      query: { readonly: StringBoolean.True },
    })
  }

  return {
    expertCategoryStore,
    confirmDeleteExpert,
    goToExpertCreate,
    goToExpertEdit,
    goToExpertView,
  }
}
