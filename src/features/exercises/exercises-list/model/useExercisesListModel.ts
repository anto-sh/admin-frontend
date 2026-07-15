import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { computed, onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useExerciseModel } from '@/entities/exercise/model'
import { useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useExercisesListModel() {
  const exerciseCategoryModel = useExerciseCategoryModel()
  const exerciseModel = useExerciseModel()
  const confirmService = useConfirm()
  const router = useRouter()

  const isLoading = computed(
    () => exerciseModel.isLoading.value || exerciseCategoryModel.isLoading.value,
  )

  onMounted(() => {
    exerciseCategoryModel.fetchAllWithEntities()
  })

  const confirmDeleteExercise = (id: number, event: MouseEvent) => {
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
        await exerciseModel.delete(id)
        exerciseCategoryModel.fetchAllWithEntities()
      },
    })
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
    confirmDeleteExercise,
    goToExerciseCreate,
    goToExerciseEdit,
    goToExerciseView,
  }
}
