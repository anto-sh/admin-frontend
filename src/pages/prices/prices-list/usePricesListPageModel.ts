import { usePriceModel } from '@/entities/price/model'
import { onMounted, ref, watch, toRaw } from 'vue'
import type { PriceDto, UpdatePriceDto } from '@/entities/price/types'
import { useEntityArrDirtyTracker } from '@/shared/composables/editable-entity-list/useEntityArrDirtyTracker'

export function usePricesListPageModel() {
  const priceModel = usePriceModel()
  const newPriceDefaultValue = { name: '', price: 0 }
  const newPrice = ref<{ name: string; price: number }>({ ...newPriceDefaultValue })
  const priceEntities = ref<PriceDto[]>([])

  onMounted(() => {
    priceModel.fetchAll()
  })

  watch(priceModel.entities, (newVal) => {
    priceEntities.value = structuredClone(toRaw(newVal))
  })

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

  const cancelAllChanges = () => priceModel.fetchAll()

  const saveAllChanges = async () => {
    if (priceEntities.value.length) {
      await priceModel.updateBatch(priceEntities.value)
      priceModel.fetchAll()
    }
  }

  const { dirtyIds, cancelChange } = useEntityArrDirtyTracker(
    priceEntities,
    () => priceModel.entities.value,
    ['name', 'price'],
  )

  return {
    priceEntities,
    newPrice,
    isLoading: priceModel.isLoading,
    dirtyIds,
    addPrice,
    updatePrice,
    deletePrice,
    cancelAllChanges,
    saveAllChanges,
    cancelChange,
  }
}
