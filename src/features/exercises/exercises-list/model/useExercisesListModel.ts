import { useExerciseCategoryStore } from '@/entities/exercise-category/store'
import { onMounted } from 'vue'
import { useConfirm } from 'primevue'
import { useExerciseStore } from '@/entities/exercise/store'
import { useRouter } from 'vue-router'
import { StringBoolean } from '@/shared/enums/common'

export function useExercisesListModel() {
  const exerciseCategoryStore = useExerciseCategoryStore()
  const exerciseStore = useExerciseStore()
  const confirmService = useConfirm()
  const router = useRouter()

  onMounted(() => {
    exerciseCategoryStore.fetchExerciseCategoriesWithExercises()
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
        await exerciseStore.deleteExercise(id)
        exerciseCategoryStore.fetchExerciseCategoriesWithExercises()
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
      query: { readonly: StringBoolean.True },
    })
  }

  return {
    exerciseCategoryStore,
    confirmDeleteExercise,
    goToExerciseCreate,
    goToExerciseEdit,
    goToExerciseView,
  }
}
