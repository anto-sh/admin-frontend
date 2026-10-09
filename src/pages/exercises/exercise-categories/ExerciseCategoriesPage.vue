<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, ConfirmPopup, useConfirm, Label } from 'primevue'
import { useExerciseCategoriesPageModel } from './useExerciseCategoriesPageModel'
import { useOperationsAvailableChecks } from '@/shared/composables/editable-entity-list/useOperationsAvailableChecks'
import type { ExerciseCategoryDto } from '@/entities/exercise-category/types'

usePageTitle('Категории упражнений')

const {
  categoriesWithExercises,
  newExerciseCategory,
  dirtyIds,
  isLoading,
  addExerciseCategory,
  updateExerciseCategory,
  deleteExerciseCategory,
  cancelChange,
} = useExerciseCategoriesPageModel()

/* ───────────────────────── confirms ───────────────────────── */
const confirmService = useConfirm()
const confirmDeleteExerciseCategory = async (
  id: number,
  relatedExercisesLength: number | undefined,
  event: Event,
) => {
  if (relatedExercisesLength)
    confirmService.require({
      target: event.target as HTMLElement,
      message: `При удалении категории удалятся и все входящие в неё упражнения.
                Сейчас в этой категории ${relatedExercisesLength} упражнений.
                Вы уверены в удалении этой категории?`,
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
      accept: () => deleteExerciseCategory(id),
    })
  else deleteExerciseCategory(id)
}

/* ──────────────────── operations available checks ─────────────────── */
const opsAvailableChecks = useOperationsAvailableChecks(dirtyIds)

const canUpdate = (category: ExerciseCategoryDto) =>
  Boolean(category.name && opsAvailableChecks.canUpdate(category.id))
const canDelete = (category: ExerciseCategoryDto) =>
  categoriesWithExercises.value.length !== 1 && opsAvailableChecks.canDelete(category.id)
const canCancel = (category: ExerciseCategoryDto) => opsAvailableChecks.isEntityChanged(category.id)
const canAdd = () =>
  Boolean(newExerciseCategory.value.name && !isLoading.value && opsAvailableChecks.canAdd())

const canEdit = (category: ExerciseCategoryDto) =>
  (opsAvailableChecks.isEntityChanged(category.id) && dirtyIds.value.length <= 1) ||
  dirtyIds.value.length === 0

/* ──────────────────────── operations ──────────────────────── */
const addCategorySecured = () => {
  if (!canAdd()) return
  addExerciseCategory()
}
</script>

<template>
  <form v-if="categoriesWithExercises.length" @submit.prevent class="w-2/3 min-w-150 space-y-2">
    <div class="category-row text-2xl font-medium">
      <h3>Название</h3>
      <h3>URL</h3>
    </div>
    <div
      v-for="item in categoriesWithExercises"
      :key="item.id"
      class="category-row"
      :class="{ 'input-group--highlighted': opsAvailableChecks.isEntityChanged(item.id) }"
    >
      <InputText :disabled="!canEdit(item)" v-model.trim="item.name" placeholder="Название" />
      <InputText
        :disabled="!canEdit(item)"
        v-model.trim="item.url"
        placeholder="Url (опционально)"
      />
      <Button
        :disabled="!canUpdate(item)"
        icon="pi pi-save"
        @click="
          updateExerciseCategory(item.id, {
            name: item.name,
            url: item.url,
          })
        "
      />
      <Button
        :disabled="!canDelete(item)"
        icon="pi pi-trash"
        severity="danger"
        @click="confirmDeleteExerciseCategory(item.id, item.exercises?.length, $event)"
      />
      <Button
        :disabled="!canCancel(item)"
        icon="pi pi-undo"
        severity="contrast"
        @click="cancelChange(item.id)"
      />
      <span class="text-gray-400">Упражнений: {{ item.exercises?.length || 0 }}</span>
    </div>
  </form>

  <form @submit.prevent class="w-2/3 min-w-150 mt-10">
    <h3 class="text-3xl mb-2">Добавить новую категорию</h3>
    <div class="new-category-row">
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium" for="new-category-text">Название</Label>
        <InputText
          id="new-category-text"
          v-model.trim="newExerciseCategory.name"
          placeholder="Название"
          @keydown.enter="addCategorySecured"
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium truncate" for="new-category-url">URL (опционально)</Label>
        <InputText
          id="new-category-url"
          v-model.trim="newExerciseCategory.url"
          placeholder="URL (опционально)"
          @keydown.enter="addCategorySecured"
        />
      </div>
      <Button
        :disabled="!canAdd()"
        label="Добавить"
        icon="pi pi-plus"
        class="self-end"
        @click="addCategorySecured"
      />
    </div>
  </form>

  <ConfirmPopup
    class="w-[400px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
