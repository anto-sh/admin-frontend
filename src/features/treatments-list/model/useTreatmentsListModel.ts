import { useTreatmentModel } from '@/entities/treatment/model'
import { onMounted, ref, toRaw, watch } from 'vue'
import type {
  CreateTreatmentDto,
  TreatmentDto,
  UpdateTreatmentDto,
} from '@/entities/treatment/types'
import { useConfirm } from 'primevue/useconfirm'

export function useTreatmentsListModel() {
  const treatmentModel = useTreatmentModel()
  const newTreatmentName = ref('')
  const confirmService = useConfirm()

  const treatmentEntities = ref<TreatmentDto[]>([])

  onMounted(() => {
    treatmentModel.fetchAll()
  })

  watch(
    treatmentModel.entities,
    () => (treatmentEntities.value = structuredClone(toRaw(treatmentModel.entities.value))),
    { deep: false },
  )

  const addTreatment = async (dto: CreateTreatmentDto) => {
    await treatmentModel.add(dto)
    newTreatmentName.value = ''
    treatmentModel.fetchAll()
  }
  const deleteTreatment = async (id: number) => {
    await treatmentModel.delete(id)
    treatmentModel.fetchAll()
  }

  const updateTreatment = async (id: number, dto: UpdateTreatmentDto) => {
    await treatmentModel.update(id, dto)
    treatmentModel.fetchAll()
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
      accept: () => {
        treatmentModel.fetchAll()
      },
    })
  }
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
      accept: async () => {
        if (treatmentEntities.value) {
          await treatmentModel.updateBatch(treatmentEntities.value)
          treatmentModel.fetchAll()
        }
      },
    })
  }
  return {
    treatmentEntities,
    newTreatmentName,
    isLoading: treatmentModel.isLoading,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    confirmCancelAll,
    confirmSaveAll,
  }
}
