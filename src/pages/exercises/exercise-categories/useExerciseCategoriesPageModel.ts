import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
} from '@/entities/exercise-category/types'
import { slugify } from 'transliteration'
import { useEntityArrDirtyTracker } from '@/shared/composables/editable-entity-list/useEntityArrDirtyTracker'

export function useExerciseCategoriesPageModel() {
  const exerciseCategoryModel = useExerciseCategoryModel()
  const newExerciseCategoryDefaultValue = {
    name: '',
    url: '',
  }
  const newExerciseCategory = ref<CreateExerciseCategoryDto>({ ...newExerciseCategoryDefaultValue })

  const categoriesWithExercises = ref<ExerciseCategoryDto[]>([])

  onMounted(() => {
    exerciseCategoryModel.fetchAllWithEntities()
  })

  watch(exerciseCategoryModel.categories, (newVal) => {
    categoriesWithExercises.value = structuredClone(toRaw(newVal))
  })

  const addExerciseCategory = async () => {
    if (!newExerciseCategory.value.url)
      newExerciseCategory.value.url = slugify(newExerciseCategory.value.name!)
    await exerciseCategoryModel.add(newExerciseCategory.value)
    newExerciseCategory.value = { ...newExerciseCategoryDefaultValue }
    exerciseCategoryModel.fetchAllWithEntities()
  }

  const updateExerciseCategory = async (id: number, dto: CreateExerciseCategoryDto) => {
    if (!dto.url) dto.url = slugify(dto.name!)
    await exerciseCategoryModel.update(id, dto)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  const deleteExerciseCategory = async (id: number) => {
    await exerciseCategoryModel.delete(id)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  const { dirtyIds, cancelChange } = useEntityArrDirtyTracker(
    categoriesWithExercises,
    () => exerciseCategoryModel.categories.value,
    ['name', 'url'],
  )

  return {
    categoriesWithExercises,
    newExerciseCategory,
    isLoading: exerciseCategoryModel.isLoading,
    dirtyIds,
    addExerciseCategory,
    updateExerciseCategory,
    deleteExerciseCategory,
    cancelChange,
  }
}
