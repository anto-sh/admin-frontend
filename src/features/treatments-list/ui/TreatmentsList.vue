<script setup lang="ts">
import { Button, InputText, ConfirmPopup } from 'primevue'
import { useTreatmentsListModel } from '../model/useTreatmentsListModel'

const {
  treatmentEntities,
  newTreatmentName,
  isLoading,
  addTreatment,
  updateTreatment,
  deleteTreatment,
  confirmCancelAll,
  confirmSaveAll,
} = useTreatmentsListModel()
</script>

<template>
  <form v-if="treatmentEntities.length" @submit.prevent class="w-1/2 min-w-120 space-y-2">
    <div v-for="item in treatmentEntities" :key="item.id" class="flex items-center gap-2">
      <InputText v-model.trim="item.name" class="w-full" placeholder="Название" />
      <Button
        :disabled="!item.name"
        icon="pi pi-save"
        @click="updateTreatment(item.id, { name: item.name })"
      />
      <Button
        :disabled="treatmentEntities.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="deleteTreatment(item.id)"
      />
    </div>
    <div class="flex gap-2 mt-6">
      <Button
        :disabled="treatmentEntities.length === 1"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="primary"
        @click="confirmSaveAll($event)"
      />
      <Button
        label="Сбросить изменения"
        icon="pi pi-times"
        severity="danger"
        @click="confirmCancelAll($event)"
      />
    </div>
  </form>
  <form @submit.prevent class="w-1/2 min-w-120 mt-10">
    <h3 class="text-xl mb-2">Добавить новый пункт</h3>
    <div class="flex gap-2">
      <InputText v-model.trim="newTreatmentName" class="w-full" placeholder="Название" />
      <Button
        :disabled="!newTreatmentName || isLoading"
        :loading="isLoading"
        label="Добавить"
        icon="pi pi-plus"
        @click="addTreatment({ name: newTreatmentName })"
      />
    </div>
  </form>
  <ConfirmPopup class="w-[400px]" />
</template>
