import { usePriceModel } from '@/entities/price/model'
import { onMounted, ref, watch, toRaw } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { PriceDto, UpdatePriceDto } from '@/entities/price/types'

export function usePricesListModel() {
  const confirmService = useConfirm()
  const priceModel = usePriceModel()

  const newPriceDefaultValue = { name: '', price: 0 }
  const newPrice = ref<{ name: string; price: number }>({ ...newPriceDefaultValue })

  const priceEntities = ref<PriceDto[]>([])

  onMounted(() => {
    priceModel.fetchAll()
  })

  watch(
    priceModel.entities,
    () => {
      priceEntities.value = structuredClone(toRaw(priceModel.entities.value))
    },
    { deep: false },
  )

  const addPrice = async () => {
    await priceModel.add(newPrice.value)
    newPrice.value = { ...newPriceDefaultValue }
    priceModel.fetchAll()
  }

  const deletePrice = async (id: number) => {
    await priceModel.delete(id)
    priceModel.fetchAll()
  }

  const updatePrice = async (id: number, dto: UpdatePriceDto) => {
    await priceModel.update(id, dto)
    priceModel.fetchAll()
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
      accept: async () => {
        if (priceEntities.value) {
          await priceModel.updateBatch(priceEntities.value)
          priceModel.fetchAll()
        }
      },
    })
  }

  return {
    priceEntities,
    newPrice,
    isLoading: priceModel.isLoading,
    addPrice,
    updatePrice,
    deletePrice,
    confirmCancelAll,
    confirmSaveAll,
  }
}
