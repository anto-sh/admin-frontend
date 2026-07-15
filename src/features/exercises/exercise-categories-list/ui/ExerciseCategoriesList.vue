<script setup lang="ts">
import { Button, InputText, ConfirmPopup } from 'primevue'
import { useExerciseCategoriesListModel } from '../model/useExerciseCategoriesListModel'

const {
  categoriesWithExercises,
  newExerciseCategory,
  addExerciseCategory,
  updateExerciseCategory,
  confirmDeleteExerciseCategory,
} = useExerciseCategoriesListModel()
</script>

<template>
  <form v-if="categoriesWithExercises.length" @submit.prevent>
    <div v-for="item in categoriesWithExercises" :key="item.id" class="my-1">
      <InputText v-model.trim="item.name" placeholder="Название" />
      <InputText v-model.trim="item.url" class="ml-2" placeholder="Url (опционально)" />
      <Button
        :disabled="!item.name"
        icon="pi pi-save"
        @click="
          updateExerciseCategory(item.id, {
            name: item.name,
            url: item.url,
          })
        "
        class="ml-2"
      />
      <Button
        :disabled="categoriesWithExercises.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="confirmDeleteExerciseCategory(item.id, item.exercises?.length, $event)"
        class="ml-1"
      />
      <span class="ml-4 text-gray-400">Упражнений: {{ item.exercises?.length || 0 }}</span>
    </div>
  </form>

  <form @submit.prevent class="mt-10">
    <h3 class="text-xl mb-2">Добавить новую категорию</h3>
    <InputText v-model.trim="newExerciseCategory.name" placeholder="Название" />
    <InputText
      v-model.trim="newExerciseCategory.url"
      class="ml-2"
      placeholder="Url (опционально)"
    />
    <Button
      :disabled="!newExerciseCategory.name"
      label="Добавить"
      icon="pi pi-plus"
      class="ml-2"
      @click="addExerciseCategory(newExerciseCategory)"
    />
  </form>

  <ConfirmPopup
    class="w-[400px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
