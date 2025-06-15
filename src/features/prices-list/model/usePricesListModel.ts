import { usePriceStore } from '@/entities/price/store'
import { onMounted, ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { CreatePriceDto } from '@/entities/price/types'

export function usePricesListModel() {
  const newPriceDefaultValue = { name: '', price: null }
  const newPrice = ref<{ name: string; price: number | null }>({ ...newPriceDefaultValue })
  const confirmService = useConfirm()
  const priceStore = usePriceStore()

  onMounted(() => {
    priceStore.fetchPrices()
  })

  const addPrice = () => {
    priceStore.addPrice(newPrice.value as CreatePriceDto)
    newPrice.value = { ...newPriceDefaultValue }
  }

  const deletePrice = (id: number) => {
    priceStore.deletePrice(id)
  }

  const confirmCancelAll = (event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: 'Вы уверены, что хотите отменить все текущие изменения цен?',
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
        priceStore.fetchPrices()
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
        priceStore.updatePricesBatch(priceStore.prices)
      },
    })
  }

  return {
    priceStore,
    newPrice,
    addPrice,
    deletePrice,
    confirmCancelAll,
    confirmSaveAll,
  }
}
