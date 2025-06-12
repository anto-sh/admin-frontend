import { useExerciseCategoryStore } from '@/entities/exercise-category/store'
import { onMounted, ref } from 'vue'
import type { CreateExerciseCategoryDto } from '@/entities/exercise-category/types'
import { slugify } from 'transliteration'
import { useConfirm } from 'primevue'

export function useExerciseCategoriesListModel() {
  const exerciseCategoryStore = useExerciseCategoryStore()
  const newExerciseCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newExerciseCategory = ref<CreateExerciseCategoryDto>({ ...newExerciseCategoryDefaultValue })
  const confirmService = useConfirm()

  onMounted(() => {
    exerciseCategoryStore.fetchExerciseCategoriesWithExercises()
  })

  const addExerciseCategory = async (dto: CreateExerciseCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await exerciseCategoryStore.addExerciseCategory(dto)
    newExerciseCategory.value = { ...newExerciseCategoryDefaultValue }
  }
  const updateExerciseCategory = (id: number, dto: CreateExerciseCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    exerciseCategoryStore.updateExerciseCategory(id, dto)
  }

  const confirmDeleteExerciseCategory = (
    id: number,
    relatedExercisesLength: number | undefined,
    event: MouseEvent,
  ) => {
    if (relatedExercisesLength)
      confirmService.require({
        target: event.target as HTMLElement,
        message: `При удалении категории удалятся и все входящие в неё упражнения.\n Сейчас в этой категории ${relatedExercisesLength} упражнений.\n Вы уверены в удалении этой категории?`,
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
          exerciseCategoryStore.deleteExerciseCategory(id)
        },
      })
    else exerciseCategoryStore.deleteExerciseCategory(id)
  }

  return {
    exerciseCategoryStore,
    newExerciseCategory,
    addExerciseCategory,
    updateExerciseCategory,
    confirmDeleteExerciseCategory,
  }
}
