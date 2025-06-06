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
  <ConfirmPopup class="w-[400px]" />
  <div v-if="treatmentStore.treatments?.length">
    <div v-for="item in treatmentStore.treatments" :key="item.id" class="my-1">
      <InputText v-model.trim="item.name" placeholder="Название" />
      <Button
        :disabled="!item.name"
        icon="pi pi-save"
        @click="treatmentStore.updateTreatment(item.id, { name: item.name })"
        class="ml-2"
      />
      <Button
        :disabled="treatmentStore.treatments.length === 1"
        icon="pi pi-trash"
        severity="danger"
        @click="deleteTreatment(item.id)"
        class="ml-1"
      />
    </div>
    <div class="mt-2">
      <Button
        :disabled="treatmentStore.treatments.length === 1"
        label="Сохранить всё"
        icon="pi pi-save"
        severity="success"
        @click="confirmSaveAll($event)"
      />
      <Button
        label="Отменить всё"
        icon="pi pi-times"
        severity="danger"
        class="ml-2"
        @click="confirmCancelAll($event)"
      />
    </div>
    <div class="mt-10">
      <h3 class="text-xl mb-2">Добавить новый пункт</h3>
      <InputText v-model.trim="newTreatmentName" placeholder="Название" />
      <Button
        :disabled="!newTreatmentName"
        label="Добавить"
        icon="pi pi-plus"
        class="ml-2"
        @click="addTreatment({ name: newTreatmentName })"
      />
    </div>
  </div>
</template>
