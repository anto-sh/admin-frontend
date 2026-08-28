import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
} from '@/entities/exercise-category/types'
import { slugify } from 'transliteration'
import { useConfirm } from 'primevue'

export function useExerciseCategoriesListModel() {
  const exerciseCategoryModel = useExerciseCategoryModel()
  const newExerciseCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newExerciseCategory = ref<CreateExerciseCategoryDto>({ ...newExerciseCategoryDefaultValue })
  const confirmService = useConfirm()

  const categoriesWithExercises = ref<ExerciseCategoryDto[]>([])

  onMounted(() => {
    exerciseCategoryModel.fetchAllWithEntities()
  })

  watch(
    () => exerciseCategoryModel.categories,
    () => {
      categoriesWithExercises.value = structuredClone(toRaw(exerciseCategoryModel.categories.value))
    },
  )

  const addExerciseCategory = async (dto: CreateExerciseCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await exerciseCategoryModel.add(dto)
    newExerciseCategory.value = { ...newExerciseCategoryDefaultValue }
    exerciseCategoryModel.fetchAllWithEntities()
  }
  const updateExerciseCategory = async (id: number, dto: CreateExerciseCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await exerciseCategoryModel.update(id, dto)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  const confirmDeleteExerciseCategory = async (
    id: number,
    relatedExercisesLength: number | undefined,
    event: MouseEvent,
  ) => {
    if (relatedExercisesLength)
      confirmService.require({
        target: event.target as HTMLElement,
        message: `При удалении категории удалятся и все входящие в неё упражнения.
                  \n Сейчас в этой категории ${relatedExercisesLength} упражнений.
                  \n Вы уверены в удалении этой категории?`,
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
          await exerciseCategoryModel.delete(id)
        },
      })
    else await exerciseCategoryModel.delete(id)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  return {
    categoriesWithExercises,
    newExerciseCategory,
    addExerciseCategory,
    updateExerciseCategory,
    confirmDeleteExerciseCategory,
  }
}
