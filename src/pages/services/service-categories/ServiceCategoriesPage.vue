<script setup lang="ts">
// TODO: подумать над выделением в общий компонент вместе с ExerciseCategoriesList
// этот компонент один в один совпадает с компонентом категорий упражнений
// Будто бы не стоит, всего один дубль, объединять их - оверинжениринг
// Или всё-таки стоит?

import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, ConfirmPopup, useConfirm } from 'primevue'
import { useServiceCategoriesPageModel } from './useServiceCategoriesPageModel'
import type { ServiceCategoryDto } from '@/entities/service-category/types'
import { useOperationsAvailableChecks } from '@/shared/composables/editable-entity-list/useOperationsAvailableChecks'

usePageTitle('Категории услуг')

const {
  categoriesWithServices,
  newServiceCategory,
  isLoading,
  dirtyIds,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  cancelChange,
} = useServiceCategoriesPageModel()

/* ───────────────────────── confirms ───────────────────────── */
const confirmService = useConfirm()
const confirmDeleteServiceCategory = async (
  id: number,
  relatedServicesLength: number | undefined,
  event: MouseEvent,
) => {
  if (relatedServicesLength)
    confirmService.require({
      target: event.target as HTMLElement,
      message: `При удалении категории удалятся и все входящие в неё услуги.
                Сейчас в этой категории ${relatedServicesLength} услуг.
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
      accept: () => deleteServiceCategory(id),
    })
  else deleteServiceCategory(id)
}

/* ──────────────────── operations available checks ─────────────────── */
const opsAvailableChecks = useOperationsAvailableChecks(dirtyIds)

const canUpdate = (category: ServiceCategoryDto) =>
  Boolean(category.name && opsAvailableChecks.canUpdate(category.id))
const canDelete = (category: ServiceCategoryDto) =>
  categoriesWithServices.value.length !== 1 && opsAvailableChecks.canDelete(category.id)
const canCancel = (category: ServiceCategoryDto) => opsAvailableChecks.isEntityChanged(category.id)
const canAdd = () =>
  Boolean(newServiceCategory.value.name && !isLoading.value && opsAvailableChecks.canAdd())

const canEdit = (category: ServiceCategoryDto) =>
  (opsAvailableChecks.isEntityChanged(category.id) && dirtyIds.value.length <= 1) ||
  dirtyIds.value.length === 0

/* ──────────────────────── operations ──────────────────────── */
const addCategorySecured = () => {
  if (!canAdd()) return
  addServiceCategory()
}
</script>

<template>
  <form v-if="categoriesWithServices.length" @submit.prevent class="w-2/3 min-w-200 space-y-2">
    <div class="category-row text-2xl font-medium">
      <h3>Название</h3>
      <h3>URL</h3>
    </div>
    <div
      v-for="item in categoriesWithServices"
      :key="item.id"
      class="category-row"
      :class="{ 'input-group--highlighted': opsAvailableChecks.isEntityChanged(item.id) }"
    >
      <InputText :disabled="!canEdit(item)" v-model.trim="item.name" placeholder="Название" />
      <InputText
        :disabled="!canEdit(item)"
        v-model.trim="item.url"
        placeholder="URL (опционально)"
      />
      <Button
        :disabled="!canUpdate(item)"
        icon="pi pi-save"
        @click="
          updateServiceCategory(item.id, {
            name: item.name,
            url: item.url,
          })
        "
      />
      <Button
        :disabled="!canDelete(item)"
        icon="pi pi-trash"
        severity="danger"
        @click="confirmDeleteServiceCategory(item.id, item.services?.length, $event)"
      />
      <Button
        :disabled="!canCancel(item)"
        icon="pi pi-undo"
        severity="contrast"
        @click="cancelChange(item.id)"
      />
      <span class="text-gray-400">Услуг: {{ item.services?.length || 0 }}</span>
    </div>
  </form>

  <form @submit.prevent class="w-2/3 min-w-200 mt-10">
    <h3 class="text-3xl mb-2">Добавить новую категорию</h3>
    <div class="new-category-row">
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium" for="new-category-text">Название</Label>
        <InputText
          id="new-category-text"
          v-model.trim="newServiceCategory.name"
          placeholder="Название"
          @keydown.enter="addCategorySecured"
        />
      </div>
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium truncate" for="new-category-url">URL (опционально)</Label>
        <InputText
          id="new-category-url"
          v-model.trim="newServiceCategory.url"
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
