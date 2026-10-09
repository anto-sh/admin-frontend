import type { ComputedRef } from 'vue'

// TODO: будто не только про UI эти состояния, скорее про допустимые операции
export const useOperationsAvailableChecks = (dirtyIds: ComputedRef<number[]>) => {
  const isEntityChanged = (id: number) => dirtyIds.value.includes(id)

  const canUpdate = (id: number) => isEntityChanged(id) && dirtyIds.value.length < 2

  const canDelete = (id: number) =>
    (isEntityChanged(id) && dirtyIds.value.length == 1) || dirtyIds.value.length == 0

  const canBatchOperation = () => dirtyIds.value.length >= 2

  const canAdd = () => dirtyIds.value.length == 0

  return {
    isEntityChanged,
    canUpdate,
    canDelete,
    canBatchOperation,
    canAdd,
  }
}
