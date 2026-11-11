<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, ConfirmPopup, useConfirm, Label } from 'primevue'
import { useExerciseCategoriesPageModel } from './useExerciseCategoriesPageModel'
import { useActionsAvailableChecks } from '@/shared/composables/entity-list-form/useActionsAvailableChecks'
import type { ExerciseCategoryDto } from '@/entities/exercise-category/types'
import { computed } from 'vue'

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
const actionsAvailableChecks = useActionsAvailableChecks(dirtyIds)

const canUpdate = (item: ExerciseCategoryDto) =>
  Boolean(item.name && actionsAvailableChecks.canUpdate(item.id))
const canDelete = (item: ExerciseCategoryDto) =>
  categoriesWithExercises.value.length !== 1 && actionsAvailableChecks.canDelete(item.id)
const canCancel = (item: ExerciseCategoryDto) => actionsAvailableChecks.isEntityChanged(item.id)
const canAdd = computed(() =>
  Boolean(newExerciseCategory.value.name && !isLoading.value && actionsAvailableChecks.canAdd()),
)

const canEdit = (item: ExerciseCategoryDto) =>
  (actionsAvailableChecks.isEntityChanged(item.id) && dirtyIds.value.length <= 1) ||
  dirtyIds.value.length === 0

/* ──────────────────────── operations ──────────────────────── */
const addCategorySecured = () => {
  if (!canAdd.value) return
  addExerciseCategory()
}
</script>

<template>
  <form
    v-if="categoriesWithExercises.length"
    @submit.prevent
    class="w-2/3 min-w-200 space-y-2"
  >
    <div class="category-row text-2xl font-medium">
      <h3>Название</h3>
      <h3>URL</h3>
    </div>
    <div
      v-for="item of categoriesWithExercises"
      :key="item.id"
      :class="{ 'input-group--highlighted': actionsAvailableChecks.isEntityChanged(item.id) }"
      class="category-row"
    >
      <InputText
        v-model.trim="item.name"
        :disabled="!canEdit(item)"
        placeholder="Название"
      />
      <InputText
        v-model.trim="item.url"
        :disabled="!canEdit(item)"
        placeholder="URL (опционально)"
      />
      <Button
        @click="
          updateExerciseCategory(item.id, {
            name: item.name,
            url: item.url,
          })
        "
        :disabled="!canUpdate(item)"
        icon="pi pi-save"
      />
      <Button
        @click="confirmDeleteExerciseCategory(item.id, item.exercises?.length, $event)"
        :disabled="!canDelete(item)"
        icon="pi pi-trash"
        severity="danger"
      />
      <Button
        @click="cancelChange(item.id)"
        :disabled="!canCancel(item)"
        icon="pi pi-undo"
        severity="contrast"
      />
      <span class="text-gray-400">Упражнений: {{ item.exercises?.length || 0 }}</span>
    </div>
  </form>

  <form
    @submit.prevent
    class="w-2/3 min-w-200 mt-10"
  >
    <h3 class="text-3xl mb-2">Добавить новую категорию</h3>
    <div class="new-category-row">
      <div class="flex flex-col gap-2">
        <Label
          class="text-xl font-medium"
          for="new-category-text"
          >Название</Label
        >
        <InputText
          id="new-category-text"
          v-model.trim="newExerciseCategory.name"
          @keydown.enter="addCategorySecured"
          placeholder="Название"
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label
          class="text-xl font-medium truncate"
          for="new-category-url"
          >URL (опционально)</Label
        >
        <InputText
          id="new-category-url"
          v-model.trim="newExerciseCategory.url"
          @keydown.enter="addCategorySecured"
          placeholder="URL (опционально)"
        />
      </div>
      <Button
        @click="addCategorySecured"
        :disabled="!canAdd"
        label="Добавить"
        icon="pi pi-plus"
        class="self-end"
      />
    </div>
  </form>

  <ConfirmPopup
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
    class="w-[400px]"
  />
</template>
