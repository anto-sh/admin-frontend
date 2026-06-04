import { usePriceModel } from '@/entities/price/model'
import { onMounted, ref, watch } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { PriceDto } from '@/entities/price/types'

export function usePricesListModel() {
  const confirmService = useConfirm()
  const priceModel = usePriceModel()

  const newPriceDefaultValue = { name: '', price: 0 }
  const newPrice = ref<{ name: string; price: number }>({ ...newPriceDefaultValue })

  const priceEntities = ref<PriceDto[]>()

  onMounted(() => {
    priceModel.fetchAll()
  })

  watch(
    priceModel.entities,
    () => (priceEntities.value = JSON.parse(JSON.stringify(priceModel.entities.value))),
    { deep: true, immediate: true },
  )

  const addPrice = () => {
    priceModel.add(newPrice.value)
    newPrice.value = { ...newPriceDefaultValue }
  }

  const deletePrice = (id: number) => {
    priceModel.delete(id)
  }

  const confirmCancelAll = (event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: 'Отменить все текущие изменения цен?',
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
        priceModel.fetchAll()
      },
    })
  }

  const confirmSaveAll = (event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: 'Сохранить все текущие изменения цен?',
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
        if (priceEntities.value) priceModel.updateBatch(priceEntities.value)
      },
    })
  }

  return {
    priceEntities,
    newPrice,
    addPrice,
    updatePrice: priceModel.update,
    deletePrice,
    confirmCancelAll,
    confirmSaveAll,
  }
}
