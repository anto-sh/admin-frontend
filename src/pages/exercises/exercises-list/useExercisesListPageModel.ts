import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { computed, onMounted } from 'vue'
import { useExerciseModel } from '@/entities/exercise/model'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useExercisesListPageModel() {
  const exerciseCategoryModel = useExerciseCategoryModel()
  const exerciseModel = useExerciseModel()
  const router = useRouter()

  const isLoading = computed(
    () => exerciseModel.isLoading.value || exerciseCategoryModel.isLoading.value,
  )

  onMounted(() => {
    exerciseCategoryModel.fetchAllWithEntities()
  })

  const deleteExercise = async (id: number) => {
    await exerciseModel.delete(id)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  const goToExerciseCreate = (categoryId?: number) => {
    router.push({
      name: 'exercise-editor',
      query: { categoryId },
    })
  }

  const goToExerciseEdit = (id: number) => {
    router.push({
      name: 'exercise-editor',
      params: { id },
    })
  }

  const goToExerciseView = (id: number) => {
    router.push({
      name: 'exercise-editor',
      params: { id },
      query: { readonly: STRING_BOOLEAN.True },
    })
  }

  return {
    categoriesWithExercises: exerciseCategoryModel.categories,
    isLoading,
    deleteExercise,
    goToExerciseCreate,
    goToExerciseEdit,
    goToExerciseView,
  }
}
