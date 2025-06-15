<script setup lang="ts">
import { Button, InputText, ConfirmPopup } from 'primevue'
import { useTreatmentsListModel } from '../model/useTreatmentsListModel'

const {
  treatmentStore,
  newTreatmentName,
  addTreatment,
  deleteTreatment,
  confirmCancelAll,
  confirmSaveAll,
} = useTreatmentsListModel()
</script>

<template>
  <div v-if="treatmentStore.treatments?.length" class="w-1/2 min-w-120 space-y-2">
    <div
      v-for="item in treatmentStore.treatments"
      :key="item.id"
      class="flex items-center gap-2"
    >
      <InputText v-model.trim="item.name" class="w-full" placeholder="Название" />
      <Button
        :disabled="!item.name"
        icon="pi pi-save"
        @click="treatmentStore.updateTreatment(item.id, { name: item.name })"
      />
      <Button
        :disabled="treatmentStore.treatments.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="deleteTreatment(item.id)"
      />
    </div>
    <div class="flex gap-2 mt-6">
      <Button
        :disabled="treatmentStore.treatments.length === 1"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="success"
        @click="confirmSaveAll($event)"
      />
      <Button
        label="Сбросить изменения"
        icon="pi pi-times"
        severity="secondary"
        @click="confirmCancelAll($event)"
      />
    </div>
  </div>
  <div class="w-1/2 min-w-120 mt-10">
    <h3 class="text-xl mb-2">Добавить новый пункт</h3>
    <div class="flex gap-2">
      <InputText v-model.trim="newTreatmentName" class="w-full" placeholder="Название" />
      <Button
        :disabled="!newTreatmentName"
        label="Добавить"
        icon="pi pi-plus"
        @click="addTreatment({ name: newTreatmentName })"
      />
    </div>
  </div>
  <ConfirmPopup class="w-[400px]" />
</template>
