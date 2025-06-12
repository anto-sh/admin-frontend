import { defineStore } from 'pinia'
import { exerciseCategoryApi } from './api'
import type {
  CreateExerciseCategoryDto,
  ExerciseCategoryDto,
  UpdateExerciseCategoryDto,
} from './types'
import { ref } from 'vue'

export const useExerciseCategoryStore = defineStore('ExerciseCategory', () => {
  const exerciseCategories = ref<ExerciseCategoryDto[]>([])

  async function fetchExerciseCategories() {
    const res = await exerciseCategoryApi.getAll()
    if (res.data) exerciseCategories.value = res.data
  }

  async function fetchExerciseCategoriesWithExercises() {
    const res = await exerciseCategoryApi.getAllWithExercises()
    if (res.data) exerciseCategories.value = res.data
  }

  async function addExerciseCategory(dto: CreateExerciseCategoryDto) {
    const res = await exerciseCategoryApi.add(dto)
    if (res.data) exerciseCategories.value?.push(res.data)
  }

  async function updateExerciseCategory(id: number, dto: UpdateExerciseCategoryDto) {
    const updatedEc = exerciseCategories.value.find((ec) => ec.id === id)
    if (updatedEc) updatedEc.url = dto.url
    await exerciseCategoryApi.update(id, dto)
  }

  async function deleteExerciseCategory(id: number) {
    await exerciseCategoryApi.delete(id)
    exerciseCategories.value = exerciseCategories.value?.filter((t) => t.id !== id)
  }

  return {
    exerciseCategories,
    fetchExerciseCategories,
    fetchExerciseCategoriesWithExercises,
    addExerciseCategory,
    updateExerciseCategory,
    deleteExerciseCategory,
  }
})
