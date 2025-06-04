import { useTreatmentStore } from '@/entities/treatment/store'
import { onMounted, ref } from 'vue'
import type { AddTreatmentDto } from '@/entities/treatment/types'
import { useConfirm } from 'primevue/useconfirm'

export function useTreatmentsListModel() {
  const treatmentStore = useTreatmentStore()
  const newTreatmentName = ref('')
  const confirm = useConfirm()

  onMounted(() => {
    treatmentStore.loadTreatments()
  })

  const addTreatment = (dto: AddTreatmentDto) => {
    treatmentStore.addTreatment(dto)
    newTreatmentName.value = ''
  }
  const deleteTreatment = (id: number) => {
    treatmentStore.deleteTreatment(id)
  }

  const confirmCancelAll = (event: MouseEvent) => {
    confirm.require({
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
      accept: () => {
        treatmentStore.loadTreatments()
      },
    })
  }
  const confirmSaveAll = (event: MouseEvent) => {
    confirm.require({
      target: event.target as HTMLElement,
      message: 'Вы уверены, что хотите сохранить все текущие изменения?',
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Нет',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Да',
      },
      accept: () => {
        treatmentStore.updateAllTreatments()
      },
    })
  }
  return {
    treatmentStore,
    newTreatmentName,
    addTreatment,
    deleteTreatment,
    confirmCancelAll,
    confirmSaveAll,
  }
}
