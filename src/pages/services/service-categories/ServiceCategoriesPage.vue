<script setup lang="ts">
// TODO: подумать над выделением в общий компонент вместе с ExerciseCategoriesList
// этот компонент один в один совпадает с компонентом категорий упражнений
// Будто бы не стоит, всего один дубль, объединять их - оверинжениринг

import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, ConfirmPopup, useConfirm } from 'primevue'
import { useServiceCategoriesPageModel } from './useServiceCategoriesPageModel'

usePageTitle('Категории услуг')

const {
  categoriesWithServices,
  newServiceCategory,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} = useServiceCategoriesPageModel()

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
</script>

<template>
  <form v-if="categoriesWithServices.length" @submit.prevent>
    <div v-for="item in categoriesWithServices" :key="item.id" class="my-1">
      <InputText v-model.trim="item.name" placeholder="Название" />
      <InputText v-model.trim="item.url" class="ml-2" placeholder="Url (опционально)" />
      <Button
        :disabled="!item.name"
        icon="pi pi-save"
        @click="
          updateServiceCategory(item.id, {
            name: item.name,
            url: item.url,
          })
        "
        class="ml-2"
      />
      <Button
        :disabled="categoriesWithServices.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="confirmDeleteServiceCategory(item.id, item.services?.length, $event)"
        class="ml-1"
      />
      <span class="ml-4 text-gray-400">Услуг: {{ item.services?.length || 0 }}</span>
    </div>
  </form>

  <form class="mt-10" @submit.prevent>
    <h3 class="text-xl mb-2">Добавить новую категорию</h3>
    <InputText v-model.trim="newServiceCategory.name" placeholder="Название" />
    <InputText v-model.trim="newServiceCategory.url" class="ml-2" placeholder="Url (опционально)" />
    <Button
      :disabled="!newServiceCategory.name"
      label="Добавить"
      icon="pi pi-plus"
      class="ml-2"
      @click="addServiceCategory(newServiceCategory)"
    />
  </form>

  <ConfirmPopup
    class="w-[400px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
