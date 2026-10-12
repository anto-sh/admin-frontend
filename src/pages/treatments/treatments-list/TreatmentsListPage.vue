<script setup lang="ts">
import { usePageTitle } from '@/shared/composables/usePageTitle'
import { Button, InputText, Label } from 'primevue'
import { useTreatmentsListPageModel } from './useTreatmentsListPageModel'
import { useActionsAvailableChecks } from '@/shared/composables/entity-list-form/useActionsAvailableChecks'
import type { TreatmentDto } from '@/entities/treatment/types'
import { computed } from 'vue'
import BatchActionsBar from '@/features/batch-actions-bar/BatchActionsBar.vue'
usePageTitle('Список "Что лечим"')

/* ───────────────────────── confirms ───────────────────────── */
const {
  treatmentEntities,
  newTreatmentName,
  isLoading,
  dirtyIds,
  addTreatment,
  updateTreatment,
  deleteTreatment,
  cancelAllChanges,
  saveAllChanges,
  cancelChange,
} = useTreatmentsListPageModel()

/* ──────────────────── operations available checks ─────────────────── */
const actionsAvailableChecks = useActionsAvailableChecks(dirtyIds)

const canUpdate = (item: TreatmentDto) =>
  Boolean(item.name && actionsAvailableChecks.canUpdate(item.id))
const canDelete = (item: TreatmentDto) =>
  treatmentEntities.value.length !== 1 && actionsAvailableChecks.canDelete(item.id)
const canCancel = (item: TreatmentDto) => actionsAvailableChecks.isEntityChanged(item.id)

const canAdd = computed(() =>
  Boolean(newTreatmentName.value && !isLoading.value && actionsAvailableChecks.canAdd()),
)
const canSaveAll = computed(
  () => treatmentEntities.value.length !== 1 && actionsAvailableChecks.canBatchOperation(),
)
const canCancelAll = computed(() => actionsAvailableChecks.canBatchOperation())

/* ──────────────────────── operations ──────────────────────── */
const addTreatmentSecured = () => {
  if (!canAdd.value) return
  addTreatment()
}
</script>

<template>
  <form v-if="treatmentEntities.length" @submit.prevent class="w-2/3 min-w-200 space-y-2">
    <div class="treatment-row text-2xl font-medium">
      <h3>Название</h3>
    </div>
    <div
      v-for="item in treatmentEntities"
      :key="item.id"
      class="treatment-row"
      :class="{ 'input-group--highlighted': actionsAvailableChecks.isEntityChanged(item.id) }"
    >
      <InputText v-model.trim="item.name" class="w-full" placeholder="Название" />
      <Button
        :disabled="!canUpdate(item)"
        icon="pi pi-save"
        @click="updateTreatment(item.id, { name: item.name })"
      />
      <Button
        :disabled="!canDelete(item)"
        icon="pi pi-trash"
        severity="danger"
        @click="deleteTreatment(item.id)"
      />
      <Button
        :disabled="!canCancel(item)"
        icon="pi pi-undo"
        severity="contrast"
        @click="cancelChange(item.id)"
      />
    </div>
    <BatchActionsBar
      :can-save-all="canSaveAll"
      :can-cancel-all="canCancelAll"
      @save-all="saveAllChanges"
      @cancel-all="cancelAllChanges"
    />
  </form>
  <form @submit.prevent class="w-2/3 min-w-200 mt-10">
    <h3 class="text-3xl mb-2">Добавить новый пункт</h3>
    <div class="new-treatment-row">
      <div class="flex flex-col gap-2">
        <Label class="text-xl font-medium" for="new-treatment-text">Название</Label>
        <InputText
          id="new-treatment-text"
          v-model.trim="newTreatmentName"
          placeholder="Название"
          class="w-full"
          @keydown.enter="addTreatmentSecured"
        />
      </div>
      <Button
        label="Добавить"
        class="self-end"
        icon="pi pi-plus"
        :loading="isLoading"
        :disabled="!canAdd"
        @click="addTreatmentSecured"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.treatment-row {
  display: grid;
  grid-template-columns: 1fr repeat(3, 2.5rem);
  align-items: center;
  column-gap: 0.5rem;
}
.new-treatment-row {
  display: grid;
  grid-template-columns: 1fr 8.5rem;
  align-items: center;
  column-gap: 0.5rem;
}

.treatment-row,
.new-treatment-row {
  & > * {
    min-width: 0;
  }
}
</style>
