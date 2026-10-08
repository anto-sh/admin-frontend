import { useExpertCategoryModel } from '@/entities/expert-category/model'
import { computed, onMounted } from 'vue'
import { useExpertModel } from '@/entities/expert/model'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useExpertsListPageModel() {
  const expertCategoryModel = useExpertCategoryModel()
  const expertModel = useExpertModel()
  const router = useRouter()

  const isLoading = computed(
    () => expertModel.isLoading.value || expertCategoryModel.isLoading.value,
  )

  onMounted(() => {
    expertCategoryModel.fetchAllWithEntities()
  })

  const deleteExpert = async (id: number) => {
    expertModel.delete(id)
    await expertCategoryModel.fetchAllWithEntities()
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
    deleteExpert,
    goToExpertCreate,
    goToExpertEdit,
    goToExpertView,
  }
}
