<script setup lang="ts">
// TODO: подумать над выделением в общий компонент вместе с ExerciseCategoriesList
// этот компонент один в один совпадает с компонентов категорий упражнений

import { Button, InputText, ConfirmPopup } from 'primevue'
import { useServiceCategoriesListModel } from '../model/useServiceCategoriesListModel'

const {
  serviceCategoryStore: scStore,
  newServiceCategory,
  addServiceCategory,
  updateServiceCategory,
  confirmDeleteServiceCategory,
} = useServiceCategoriesListModel()
</script>

<template>
  <template v-if="scStore.serviceCategories?.length">
    <div v-for="item in scStore.serviceCategories" :key="item.id" class="my-1">
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
        :disabled="scStore.serviceCategories.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="confirmDeleteServiceCategory(item.id, item.services?.length, $event)"
        class="ml-1"
      />
      <span class="ml-4 text-gray-400">Услуг: {{ item.services?.length || 0 }}</span>
    </div>
  </template>
  <div class="mt-10">
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
  </div>
  <ConfirmPopup
    class="w-[400px]"
    :pt="{
      message: { style: 'white-space: pre-line;' },
    }"
  />
</template>
