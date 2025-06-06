import { defineStore } from 'pinia'
import { exerciseApi } from './api'
import type { CreateExerciseDto, ExerciseDto, UpdateExerciseDto } from './types'
import { ref } from 'vue'

export const useExerciseStore = defineStore('Exercise', () => {
  const exercises = ref<ExerciseDto[]>([])

  async function fetchExercises() {
    const res = await exerciseApi.getAll()
    if (res.data) exercises.value = res.data
  }

  async function fetchExerciseById(id: number) {
    return await exerciseApi.getById(id)
  }

  async function addExercise(dto: CreateExerciseDto) {
    const res = await exerciseApi.add(dto)
    if (res.data) exercises.value?.push(res.data)
  }

  async function updateExercise(id: number, dto: UpdateExerciseDto) {
    await exerciseApi.update(id, dto)
  }

  async function deleteExercise(id: number) {
    await exerciseApi.delete(id)
    exercises.value = exercises.value?.filter((t) => t.id !== id)
  }

  return {
    exercises,
    fetchExercises,
    fetchExerciseById,
    addExercise,
    updateExercise,
    deleteExercise,
  }
})
