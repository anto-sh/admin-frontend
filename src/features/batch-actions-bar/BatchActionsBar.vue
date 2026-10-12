<script setup lang="ts">
import { useConfirm, Button, ConfirmPopup } from 'primevue'

/* ───────────────────────── confirms ───────────────────────── */

const emit = defineEmits<{
  saveAll: []
  cancelAll: []
}>()
const props = defineProps<{
  canCancelAll: boolean
  canSaveAll: boolean
}>()

const confirmService = useConfirm()

const confirmSaveAll = (event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: 'Сохранить все текущие изменения?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Нет',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Да',
    },
    accept: () => emit('saveAll'),
  })
}

const confirmCancelAll = (event: MouseEvent) => {
  confirmService.require({
    target: event.target as HTMLElement,
    message: 'Вы уверены, что хотите отменить все текущие изменения?',
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
    accept: () => emit('cancelAll'),
  })
}
</script>

<template>
  <div class="flex gap-2 mt-6">
    <Button
      :disabled="!props.canSaveAll"
      label="Сохранить всё"
      icon="pi pi-save"
      severity="primary"
      @click="confirmSaveAll($event)"
    />
    <Button
      :disabled="!props.canCancelAll"
      label="Сбросить изменения"
      icon="pi pi-times"
      severity="danger"
      @click="confirmCancelAll($event)"
    />
  </div>
  <ConfirmPopup class="w-[400px]" />
</template>
