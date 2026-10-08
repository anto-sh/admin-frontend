import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
} from '@/entities/exercise-category/types'
import { slugify } from 'transliteration'

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

  const deleteExerciseCategory = async (id: number) => {
    await exerciseCategoryModel.delete(id)
    exerciseCategoryModel.fetchAllWithEntities()
  }

  return {
    categoriesWithExercises,
    newExerciseCategory,
    addExerciseCategory,
    updateExerciseCategory,
    deleteExerciseCategory,
  }
}
